import {type EasingFunction, fly, type TransitionConfig} from "svelte/transition";
import {cubicOut} from "svelte/easing";
import {interpolateTransformCss} from "d3-interpolate";

export interface MoveParams {
    delay?: number;
    duration?: number | ((len: number) => number);
    easing?: EasingFunction;
}

/**
 * The `moveFrom` function creates a pair of [transitions](https://svelte.dev/docs/svelte/transition) called `disappear` and `receive`. When an element is 'received', it looks for a corresponding element being 'sent', and generates a transition that transforms the element from its counterpart's position. When an element is 'sent', it disappears immediately. If there is no counterpart, the `fallback` transition is used.
 *
 * This is similar to `crossfade`, but keeps the element fully opaque while transitioning, supports transforms, and looks consistent when moving from an overflow-hidden container.
 */
export function moveFrom({ fallback, ...defaults }: MoveParams & { fallback?: (node: Element, params: MoveParams, intro: boolean) => TransitionConfig; }): [(node: any, params: MoveParams & { key: any; }) => () => TransitionConfig, (node: any, params: MoveParams & { key: any; }) => () => TransitionConfig] {
    const to_receive: Map<any, Element> = new Map();
    const to_send: Map<any, Element> = new Map();

    function disappear(params: MoveParams): TransitionConfig {
        const {delay = 0,} = assign(assign({}, defaults), params);
        return {
            delay,
            duration: 1,
            css: _ => `display: none;`
        };
    }

    function moveFrom(from_node: Element, node: Element, params: MoveParams): TransitionConfig {
        const {
            delay = 0,
            duration = (d: number) => Math.sqrt(d) * 30,
            easing = cubicOut
        } = assign(assign({}, defaults), params);
        const from = from_node.getBoundingClientRect();
        const to = node.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        const d = Math.sqrt(dx * dx + dy * dy);
        const from_style = getComputedStyle(from_node);
        const style = getComputedStyle(node);
        const from_transform = `${from_style.transform === 'none' ? '' : from_style.transform} translate(${dx}px, ${dy}px)`;
        const transform = style.transform === 'none' ? '' : style.transform;
        const interpolator: (t: number) => string = interpolateTransformCss(from_transform, transform);
        return {
            delay,
            duration: typeof duration === 'function' ? duration(d) : duration,
            easing,
            css: t => `transform: ${interpolator(t)};`
        };
    }

    function outTransition(items: Map<any, Element>, counterparts: Map<any, Element>): (node: any, params: MoveParams & { key: any; }) => () => TransitionConfig {
        return (node, params) => {
            items.set(params.key, node);
            return () => {
                counterparts.delete(params.key);
                return disappear(params);
            };
        };
    }

    function inTransition(items: Map<any, Element>, counterparts: Map<any, Element>): (node: any, params: MoveParams & { key: any; }) => () => TransitionConfig {
        return (node, params) => {
            items.set(params.key, node);
            return () => {
                if (counterparts.has(params.key)) {
                    const other_node = counterparts.get(params.key)!;
                    counterparts.delete(params.key);
                    return moveFrom(other_node, node, params);
                }
                // if the node is disappearing altogether
                // (i.e. wasn't claimed by the other list)
                // then we need to supply an outro
                items.delete(params.key);
                return fallback?.(node, params, true) ?? fly(node, {delay: params.delay, duration: typeof params.duration === "number" ? params.duration : params.duration?.(1000), x: 0, y: -1000, easing: params.easing});
            };
        };
    }

    return [outTransition(to_send, to_receive), inTransition(to_receive, to_send)];
}

/**
 * The `moveTo` function creates a pair of [transitions](https://svelte.dev/docs/svelte/transition) called `send` and `appear`. When an element is 'sent', it looks for a corresponding element being 'received', and generates a transition that transforms the element to its counterpart's position. When an element is 'received', it appears after a delay. If there is no counterpart, the `fallback` transition is used.
 *
 * This is similar to `crossfade`, but keeps the element fully opaque while transitioning, supports transforms, and looks consistent when moving to an overflow-hidden container.
 */
export function moveTo({ fallback, ...defaults }: MoveParams & { fallback?: (node: Element, params: MoveParams, intro: boolean) => TransitionConfig; }): [(node: any, params: MoveParams & { key: any; }) => () => TransitionConfig, (node: any, params: MoveParams & { key: any; }) => () => TransitionConfig] {
    const to_receive: Map<any, Element> = new Map();
    const to_send: Map<any, Element> = new Map();

    function moveTo(from_node: Element, node: Element, params: MoveParams): TransitionConfig {
        const {
            delay = 0,
            duration = (d: number) => Math.sqrt(d) * 30,
            easing = cubicOut
        } = assign(assign({}, defaults), params);
        const from = from_node.getBoundingClientRect();
        const to = node.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        const d = Math.sqrt(dx * dx + dy * dy);
        const from_style = getComputedStyle(from_node);
        const style = getComputedStyle(node);
        const from_transform = `${from_style.transform === 'none' ? '' : from_style.transform} translate(${dx}px, ${dy}px)`;
        console.log(from_transform);
        const transform = style.transform === 'none' ? '' : style.transform;
        console.log(transform);
        const interpolator: (t: number) => string = interpolateTransformCss(from_transform, transform);
        return {
            delay,
            duration: typeof duration === 'function' ? duration(d) : duration,
            easing,
            css: t => `transform: ${interpolator(t)};`
        };
    }

    function appear(from_node: Element, node: Element, params: MoveParams): TransitionConfig {
        const {
            delay = 0,
            duration = (d: number) => Math.sqrt(d) * 30,
            easing = cubicOut
        } = assign(assign({}, defaults), params);
        const from = from_node.getBoundingClientRect();
        const to = node.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        const d = Math.sqrt(dx * dx + dy * dy);
        return {
            delay,
            duration: typeof duration === 'function' ? duration(d) : duration,
            easing,
            css: _ => `opacity: 0;`
        };
    }

    function outTransition(items: Map<any, Element>, counterparts: Map<any, Element>): (node: any, params: MoveParams & { key: any; }) => () => TransitionConfig {
        return (node, params) => {
            items.set(params.key, node);
            return () => {
                if (counterparts.has(params.key)) {
                    const other_node = counterparts.get(params.key)!;
                    counterparts.delete(params.key);
                    return moveTo(other_node, node, params);
                }
                // if the node is disappearing altogether
                // (i.e. wasn't claimed by the other list)
                // then we need to supply an outro
                items.delete(params.key);
                return fallback?.(node, params, false) ?? fly(node, {delay: params.delay, duration: typeof params.duration === "number" ? params.duration : params.duration?.(1000), x: 0, y: -1000, easing: params.easing});
            };
        };
    }

    function inTransition(items: Map<any, Element>, counterparts: Map<any, Element>): (node: any, params: MoveParams & { key: any; }) => () => TransitionConfig {
        return (node, params) => {
            items.set(params.key, node);
            return () => {
                if (counterparts.has(params.key)) {
                    const other_node = counterparts.get(params.key)!;
                    counterparts.delete(params.key);
                    return appear(other_node, node, params);
                }
                // if the node is disappearing altogether
                // (i.e. wasn't claimed by the other list)
                // then we need to supply an outro
                items.delete(params.key);
                return fallback?.(node, params, true) ?? fly(node, {delay: params.delay, duration: typeof params.duration === "number" ? params.duration : params.duration?.(1000), x: 0, y: -1000, easing: params.easing});
            };
        };
    }

    return [outTransition(to_receive, to_send), inTransition(to_send, to_receive)];
}

function assign(tar: any, src: any) {
    // @ts-ignore
    for (const k in src) tar[k] = src[k];
    return /** @type {T & S} */ (tar);
}

export interface FlipParams {
    delay?: number;
    duration?: number | ((len: number) => number);
    easing?: (t: number) => number;
}

/**
 * The flip function calculates the start and end position of an element and animates between them, translating the x and y values.
 * `flip` stands for [First, Last, Invert, Play](https://aerotwist.com/blog/flip-your-animations/).
 */
export function flipTransform(node: Element, { from, to }: { from: DOMRect, to: DOMRect}, params: FlipParams = {}) {
    const style = getComputedStyle(node);
    const zoom = get_zoom(node); // https://drafts.csswg.org/css-viewport/#effective-zoom

    const transform = style.transform === 'none' ? '' : style.transform;
    const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
    const dsx = from.width / to.width;
    const dsy = from.height / to.height;

    const dx = (from.left + dsx * ox - (to.left + ox)) / zoom;
    const dy = (from.top + dsy * oy - (to.top + oy)) / zoom;
    const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;

    const from_transform = `${style.transform === 'none' ? '' : style.transform} translate(${dx}px, ${dy}px)`;
    const interpolator: (t: number) => string = interpolateTransformCss(from_transform, transform);

    return {
        delay,
        duration: typeof duration === 'function' ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
        easing,
        css: (t: number) => `transform: ${interpolator(t)};`
    };
}

function get_zoom(element: Element): number {
    if ('currentCSSZoom' in element) {
        return element.currentCSSZoom;
    }

    let current: Element | null = element;
    let zoom = 1;

    while (current !== null) {
        zoom *= +getComputedStyle(current).zoom;
        current = current.parentElement;
    }

    return zoom;
}

<script lang="ts">
    import type {MouseEventHandler} from "svelte/elements";
    import { inlineSvg } from '@svelte-put/inline-svg';

    interface Props {
        onclick?: MouseEventHandler<HTMLButtonElement>;
        value: number;
        flipped?: boolean;
        disabled?: boolean;
    }

    let { onclick, value, flipped = false, disabled = false }: Props = $props();

    let symbol = $derived(value === 1 ? 'A' : value);
    let symbolPositions = $derived.by(() => {
        switch(value) {
            case 0: return [{ x: 1, y: 3, size: 1, inverted: false }, { x: 10, y: 12, size: 1, inverted: true }];
            case 1: return [{ x: 1, y: 3, size: 1, inverted: false }, { x: 10, y: 12, size: 1, inverted: true }, { x: 4, y: 6, size: 4, inverted: false }];
            case 2: return [{ x: 1, y: 3, size: 1, inverted: false }, { x: 10, y: 12, size: 1, inverted: true }, { x: 5, y: 3, size: 2, inverted: false }, { x: 5, y: 11, size: 2, inverted: true }];
            case 3: return [{ x: 1, y: 3, size: 1, inverted: false }, { x: 10, y: 12, size: 1, inverted: true }, { x: 5, y: 3, size: 2, inverted: false }, { x: 5, y: 7, size: 2, inverted: false }, { x: 5, y: 11, size: 2, inverted: true }];
            case 5: return [{ x: 1, y: 3, size: 1, inverted: false }, { x: 10, y: 12, size: 1, inverted: true }, { x: 3, y: 3, size: 2, inverted: false }, { x: 7, y: 3, size: 2, inverted: false }, { x: 5, y: 7, size: 2, inverted: false }, { x: 3, y: 11, size: 2, inverted: true }, { x: 7, y: 11, size: 2, inverted: true }];
            case 8: return [{ x: 1, y: 3, size: 1, inverted: false }, { x: 10, y: 12, size: 1, inverted: true }, { x: 3, y: 3, size: 2, inverted: false }, { x: 7, y: 3, size: 2, inverted: false }, { x: 5, y: 5, size: 2, inverted: false }, { x: 3, y: 7, size: 2, inverted: false }, { x: 7, y: 7, size: 2, inverted: false }, { x: 5, y: 9, size: 2, inverted: true }, { x: 3, y: 11, size: 2, inverted: true }, { x: 7, y: 11, size: 2, inverted: true }];
            case 13: return [{ x: 1, y: 3, size: 1, inverted: false }, { x: 10, y: 12, size: 1, inverted: true }, { x: 3, y: 3, size: 2, inverted: false }, { x: 3, y: 5, size: 2, inverted: false }, { x: 3, y: 7, size: 2, inverted: false }, { x: 3, y: 9, size: 2, inverted: true }, { x: 3, y: 11, size: 2, inverted: true }, { x: 7, y: 3, size: 2, inverted: false }, { x: 7, y: 5, size: 2, inverted: false }, { x: 7, y: 7, size: 2, inverted: false }, { x: 7, y: 9, size: 2, inverted: true }, { x: 7, y: 11, size: 2, inverted: true }, { x: 5, y: 4, size: 2, inverted: false }, { x: 5, y: 7, size: 2, inverted: false }, { x: 5, y: 10, size: 2, inverted: true }];
            default: return [];
        }
    });

    function move(e: MouseEvent & { currentTarget: (EventTarget & HTMLDivElement) }) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.x - rect.left;
        const y = e.y - rect.top;
        const t = x * 2 / rect.width - 1;
        const u = y * 2 / rect.height - 1;
        e.currentTarget.style.transform = `rotateX(${u * 10}deg) rotateY(${-t * 10}deg)`;
    }

    function reset(e: MouseEvent & { currentTarget: (EventTarget & HTMLDivElement) }) {
        e.currentTarget.style.transform = `none`;
    }
</script>

<div class="w-[10rem] aspect-[3/4] relative perspective">
    <div class="bg-white dark:bg-black rounded absolute size-full drop-shadow transition-transform" class:face-up={!flipped} class:face-down={flipped}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" class="text-red dark:text-gold font-sans text-[1.4pt] font-bold select-none">
            <text x="1" y="2.5" fill="currentColor" textLength="1" lengthAdjust="spacingAndGlyphs">{ symbol }</text>
            <text x="1" y="2.5" fill="currentColor" textLength="1" lengthAdjust="spacingAndGlyphs" class="origin-center rotate-180">{ symbol }</text>
            {#each symbolPositions as {x, y, size, inverted}}
                <svg {x} y={inverted ? -y - size : y} width={ size } height={ size } class:-scale-y-100={inverted} use:inlineSvg={'/svg/heart.svg'}/>
            {/each}
        </svg>
    </div>
    <div class="bg-white dark:bg-black rounded absolute size-full transition-transform" class:face-up={flipped} class:face-down-reverse={!flipped}>
        <div class="rounded card-pattern"></div>
    </div>
    <button aria-label={`${symbol}`} class="{disabled ? 'bg-white/60 ' : ''}rounded absolute size-full transition-colors overlay" {onclick} {disabled}></button>
</div>

<style>
    .perspective {
        perspective: 300px;
        transform-style: preserve-3d;
    }

    .face-up {
        transform: translateZ(0) rotateY(0deg);
    }

    .face-down {
        transform: translateZ(-1pt) rotateY(180deg);
    }

    .face-down-reverse {
        transform: translateZ(-1pt) rotateY(-180deg);
    }

    .overlay {
        transform: translateZ(1pt);
    }

    .card-pattern {
        height: calc(100% - 1rem);
        margin: 0.5rem;

        --s: 2rem;
        --c1: rgb(var(--white));
        --c2: rgb(var(--red));
        --c3: rgb(var(--red));

        --_g: 50%,#0000 37%,var(--c1) 39% 70%,#0000 72%;
        --_t: 50%,var(--c2) 40deg,var(--c3) 0 140deg,var(--c2) 0 180deg,#0000 0;
        --_s: 47% 50% at;
        background:
                radial-gradient(var(--_s) -10% var(--_g)) 0 calc(var(--s)/2),
                radial-gradient(var(--_s) -10% var(--_g)) calc(var(--s)/2) 0,
                radial-gradient(var(--_s) 110% var(--_g)),
                radial-gradient(var(--_s) 110% var(--_g)) calc(var(--s)/2) calc(var(--s)/2),
                conic-gradient(from   0deg at 55% var(--_t)) calc(var(--s)/4) 0,
                conic-gradient(from 180deg at 45% var(--_t)) calc(var(--s)/4) 0,
                var(--c2);
        background-size: var(--s) var(--s);
    }

    @media (prefers-color-scheme: dark) {
        .card-pattern {
            --c1: rgb(var(--gold));
            --c2: rgb(var(--black));
            --c3: rgb(var(--black));
        }
    }
</style>

<script lang="ts">
    import type {Placement} from "$lib/placement";
    import type {MouseEventHandler} from "svelte/elements";
    import {crossfade} from "svelte/transition";

    interface Props {
        onclick?: MouseEventHandler<HTMLButtonElement>;
        value: number;
        id?: any;
        flipped?: boolean;
        disabled?: boolean;
    }

    let { onclick, value, id = undefined, flipped = false, disabled = false }: Props = $props();

    const [send, receive] = crossfade({
        duration: 500,
    });

    function getPlacements(value: number): Placement[] {
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
    }

    let symbol = $derived(value === 1 ? 'A' : value);
    let placements = $derived(getPlacements(value));
</script>

<div in:receive|global={{ key: id }} out:send|global={{ key: id }} class="card { flipped ? 'flipped' : '' } { disabled ? 'disabled' : '' }">
    <div class="card-front { disabled ? 'disabled' : '' }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16">
            <text x="1" y="2.5" class="card-text" textLength="1" lengthAdjust="spacingAndGlyphs">{ (id + '').slice(-3) }</text>
            <text x="11" y="13.5" class="card-text" textLength="1" lengthAdjust="spacingAndGlyphs" rotate="180">{ symbol }</text>
            {#each placements as placement}
                <svg xmlns="http://www.w3.org/2000/svg"
                        fill="#fb3657"
                        x={ placement.x }
                        y={ placement.y }
                        width={ placement.size }
                        height={ placement.size }
                        viewBox="0 0 512 512">
                    <path
                            transform={ placement.inverted ? 'translate(0,512) scale(1,-1)' : '' }
                            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                </svg>
            {/each}
        }
        </svg>
    </div>
    <div class="card-back">
        <div class="card-pattern"></div>
    </div>
    <button class="button" {onclick} {disabled}></button>
</div>

<style>
    .card {
        position: relative;
        width: 10em;
        aspect-ratio: 3/4;
        perspective: 300px;
        transform-style: preserve-3d;
    }

    .card-front {
        background-color: white;
        border-radius: 1em;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 2pt 3pt #00000040);
        transform: translateZ(0) rotateY(0deg);
        transition: transform 300ms ease-in-out;
    }

    .card-back {
        background-color: white;
        border-radius: 1em;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateZ(-1pt) rotateY(180deg);
        transition: transform 300ms ease-in-out;
    }

    .card-pattern {
        border-radius: 0.5em;
        height: calc(100% - 1em);
        margin: 0.5em;

        --s: 2em; /* control the size*/
        --c1: white;
        --c2: #fb3657;
        --c3: #fb3657;

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

    .flipped .card-front {
        transform: translateZ(-1pt) rotateY(-180deg);
    }

    .flipped .card-back {
        transform: translateZ(0pt) rotateY(0deg);
    }

    .card-text {
        fill: #fb3657;
        font-family: sans-serif;
        font-size: 1.4pt;
        font-weight: bold;
        user-select: none;
    }

    .button {
        border-radius: 1em;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        transform: translateZ(1pt);
        transition: background-color 100ms ease-in;
    }

    .disabled .button {
        background-color: #ffffff80;
    }
</style>

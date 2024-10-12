<script lang="ts" generics="T">
    import type {Snippet} from "svelte";
    import { flip } from "svelte/animate";

    interface Props<T> {
        card: Snippet<[T]>,
        values: T[],
    }

    let { card, values }: Props<T> = $props();

    // Because `animate:flip` does not work well on elements with a CSS transition, remove the transition while the flip animation runs
    let enableHoverTransition = $state(true);

    $effect.pre(() => {
        if(values) {
            enableHoverTransition = false;
            setTimeout(() => enableHoverTransition = true, 450);
        }
    })
</script>

<div class="hand" class:size-6={values.length === 6} class:size-7={values.length === 7}>
    {#each values as value (value)}
        <div animate:flip={{ duration: 400, delay: 50 }} class="card" class:hover={enableHoverTransition}>
            {@render card(value)}
        </div>
    {/each}
</div>

<style lang="scss">
    .hand {
        display: flex;
        padding-top: 1em;
        justify-content: center;
        overflow: hidden;
    }

    .hover {
        transition: transform 100ms ease-in;
    }

    $minCards: 6;
    $maxCards: 7;

    @for $numCards from $minCards through $maxCards {
      @for $i from 1 through $numCards {
        $offset: calc($i - $numCards / 2 - 0.5);

        .size-#{$numCards} .card:nth-child(#{$i}) {
          transform: rotate(#{7 * $offset}deg) translateX(#{-6 * $offset}em) translateY(#{pow($offset, 2)}em);
        }

        .size-#{$numCards} .card:nth-child(#{$i}):hover {
          transform: rotate(0deg) translateX(#{-6 * $offset}em) translateY(-1em);
          z-index: 1;
        }

        @media (min-width: 768px) {
          .size-#{$numCards} .card:nth-child(#{$i}) {
            transform: rotate(#{7 * $offset}deg) translateX(#{-1.8 * $offset}em) translateY(#{pow($offset, 2)}em);
          }

          .size-#{$numCards} .card:nth-child(#{$i}):hover {
            transform: rotate(0deg) translateX(#{-1.8 * $offset}em) translateY(-1em);
            z-index: 1;
          }
        }
      }
    }
</style>

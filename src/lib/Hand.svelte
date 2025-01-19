<script lang="ts" generics="T">
    import type {Snippet} from "svelte";
    import {flipTransform} from "$lib/move";

    interface Props<T> {
        card: Snippet<[T]>,
        values: T[],
        ids?: (value: T) => any,
    }

    const flipParams = { duration: 400, delay: 50 };

    let { card, values, ids }: Props<T> = $props();

    // Because `animate:flip` does not work well on elements with a CSS transition, remove the transition while the flip animation runs
    let enableTransitions = $state(false);
    // $effect(() => {
    //     // Effect runs whenever values changes, as that will trigger the flip animation
    //     if (values) {
    //         const id1 = setTimeout(() => enableTransitions = false, flipParams.delay);
    //         const id2 = setTimeout(() => enableTransitions = true, flipParams.delay + flipParams.duration);
    //         return () => {
    //             clearTimeout(id1);
    //             clearTimeout(id2);
    //         }
    //     }
    // });
</script>

<div class="flex size-full pt-[1rem] justify-center overflow-hidden" class:size-6={values.length === 6} class:size-7={values.length === 7}>
    {#each values as value (ids?.(value))}
        <div animate:flipTransform={flipParams} class:transition-transform={enableTransitions} class="card">
            {@render card(value)}
        </div>
    {/each}
</div>

<style lang="scss">
    $minCards: 6;
    $maxCards: 7;

    @for $numCards from $minCards through $maxCards {
      @for $i from 1 through $numCards {
        $offset: calc($i - $numCards / 2 - 0.5);

        .size-#{$numCards} .card:nth-child(#{$i}) {
          transform: rotate(#{7 * $offset}deg) translateX(#{-6 * $offset}rem) translateY(#{pow($offset, 2)}rem);
        }

        .size-#{$numCards} .card:nth-child(#{$i}):hover {
          transform: rotate(0deg) translateX(#{-6 * $offset}rem) translateY(-1rem);
          z-index: 1;
        }

        @media (min-width: 768px) {
          .size-#{$numCards} .card:nth-child(#{$i}) {
            transform: rotate(#{7 * $offset}deg) translateX(#{-1.8 * $offset}rem) translateY(#{pow($offset, 2)}rem);
          }

          .size-#{$numCards} .card:nth-child(#{$i}):hover {
            transform: rotate(0deg) translateX(#{-1.8 * $offset}rem) translateY(-1rem);
            z-index: 1;
          }
        }
      }
    }
</style>

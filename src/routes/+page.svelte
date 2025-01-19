<script lang="ts">
    import Card from "$lib/Card.svelte";
    import Hand from "$lib/Hand.svelte";
    import {moveFrom, type MoveParams, moveTo} from "$lib/move";

    const allValues = [0, 1, 2, 3, 5, 8, 13];

    const moveParams: MoveParams = { duration: (d) => d / 2 };
    const [disappear, receive] = moveFrom(moveParams);
    const [send, appear] = moveTo(moveParams);

    let selected: number | null = $state(null);
    let showHand = $state(true);
    let flipTable = $state(false);
    let flipHand = $state(false);

    let values = $derived(allValues.filter(value => value !== selected));
</script>

<main class="flex flex-col min-h-screen bg-green dark:bg-gray">
    <div class="grow">
        <button onclick={_ => flipHand = !flipHand}>Flip</button>
    {#if selected !== null}
        <div in:receive|global={{ key: selected }} out:send|global="{{ key: selected }}">
            <Card flipped={flipTable} onclick={_ => selected = null} value={selected}/>
        </div>
    {:else}
        <div class="bg-blacker/30 w-[10rem] aspect-[3/4] rounded"></div>
    {/if}
    </div>
    <div class:basis-[13.5rem]={showHand} class:basis-0={!showHand} class="transition-flex shrink overflow-hidden hand">
        <Hand {values} ids={value => value}>
            {#snippet card(value)}
                <div in:appear|global={{ key: value }} out:disappear|global="{{ key: value }}">
                    <Card flipped={flipHand} onclick={_ => selected = value} {value}/>
                </div>
            {/snippet}
        </Hand>
    </div>
</main>

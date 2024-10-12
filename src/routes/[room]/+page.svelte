<script lang="ts">
    import Button from "../../components/Button.svelte";
    import Card from "../../components/Card.svelte";
    import Hand from "../../components/Hand.svelte";
    import Throbber from "../../components/Throbber.svelte";
    import type {PageData} from "./$types";
    import {getClient} from "$lib/client";
    import {onMount} from "svelte";
    import type {Room} from "$lib/room";

    interface Props {
        data: PageData;
    }

    let {data}: Props = $props();

    let api = $derived(getClient(data.userId, data.config));

    let currentRoom: Room | null = $state(null);
    let disabled = $state(true);
    let done = $state(false);

    let selectedCard: number | null = $derived(responseToCard((currentRoom as Room | null)?.users.find(user => user.userId === data.userId)?.card));
    let values = $derived([0, 1, 2, 3, 5, 8, 13].filter(number => number !== selectedCard));

    onMount(async () => {
        await updateState();
        setInterval(async () => {
            if (done) {
                done = false;
                await updateState();
            }
        }, 3000)
    })

    async function updateState() {
        await api.getRoom(data.roomId)
            .then(
                room => {
                    currentRoom = room;
                    done = true;
                    disabled = false;
                }
            );
    }

    function responseToCard(card: string | undefined): number | null {
        if (!card) {
            return null;
        } else {
            return +card;
        }
    }

    async function playCard(card: number) {
        disabled = true;
        done = false;
        await api.submitCard(data.roomId, card).then(_ => updateState());
    }

    async function revealConceal() {
        disabled = true;
        done = false;
        if (currentRoom?.revealed) {
            await api.conceal(data.roomId).then(_ => updateState());
        } else {
            await api.reveal(data.roomId).then(_ => updateState());
        }
    }

    async function reset() {
        disabled = true;
        done = false;
        await api.reset(data.roomId).then(_ => updateState());
    }
</script>

<main>
    {#if !currentRoom}
        <div class="center">
            <Throbber/>
        </div>
    {:else}
        <div class="slots">
            {#each Array(currentRoom.users.length) as index (index)}
                {@const users = currentRoom.users.filter(user => user.card) }
                <div class="slot">
                    {#each users as user (user.userId)}
                        <Card
                                value={responseToCard(user.card) ?? 0}
                                id={user.userId + user.card}
                                flipped={!(currentRoom.revealed || user.userId === data.userId)}/>
                    {/each}
                </div>
            {/each}
        </div>

        {#if currentRoom.hostUserId === data.userId}
            <div class="button-bar">
                <Button onclick={revealConceal} {disabled}>
                    {#if currentRoom.revealed}Hide{:else}Reveal{/if}
                </Button>
                <Button onclick={reset} {disabled}>Reset</Button>
            </div>
        {/if}

        <div class="hand" class:hidden={currentRoom == null || currentRoom.revealed}>
            {#snippet card(value)}
                <Card
                        onclick={() => playCard(value)}
                        {value}
                        id={data.userId + `${value}`}
                        {disabled}
                        flipped={currentRoom == null || currentRoom.revealed}/>
            {/snippet}
            <Hand {card} {values}/>
        </div>
    {/if}
</main>

<style>
    main {
        background-color: #2c8549;
        display: flex;
        flex-direction: column;
        gap: 1em;
        flex-grow: 1;
        height: 100%;
        overflow: scroll;
    }

    .center {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .slots {
        display: flex;
        padding: 1em;
        flex-wrap: wrap;
        place-content: center;
        gap: 1em;
        flex-grow: 1;
        margin: 0 auto;
        transition: flex 0.5s ease-in-out;
    }

    .slot {
        width: 10em;
        aspect-ratio: 3/4;
        background-color: #00000040;
        border-radius: 1em;
    }

    .button-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2em;
        flex-grow: 1;
        flex-direction: column;
        transition: flex 0.5s ease-in-out;
    }

    .hand {
        transition: flex 0.5s ease-in-out;
        overflow: hidden;
        flex-basis: 13.5em;
        flex-shrink: 0;
        min-height: 1px;
    }

    .hidden {
        flex-basis: 0;
    }

    @media (min-width: 768px) {
        .slots {
            max-width: 67%;
        }

        .button-bar {
            flex-direction: row;
        }
    }
</style>
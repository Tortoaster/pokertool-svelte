<script lang="ts">
    import type {MouseEventHandler} from "svelte/elements";
    import type {Snippet} from "svelte";

    interface Props {
        children: Snippet,
        onclick: MouseEventHandler<HTMLButtonElement>;
        disabled: boolean;
    }

    let { children, onclick, disabled }: Props = $props();
</script>

<button class="button" {onclick} {disabled}>
    {@render children()}
</button>

<style>
    .button {
        background-color: #f5ca46;
        border-radius: 2em;
        box-shadow: #00000040 0 0.1em 1em;
        color: #26211f;
        font-family: sans-serif;
        font-weight: bold;
        min-width: 15em;
        padding: 1em 2em;
        line-height: 16pt;
        vertical-align: middle;
        transition: background-color 100ms ease-in;
    }

    .button:hover {
        background-color: #ffdb64;
    }

    .button:active {
        background-color: #e18f24;
        box-shadow: #00000040 0 0.1em 0.5em;
    }

    .button:disabled {
        background-color: #afa08e;
        box-shadow: #00000040 0 0.1em 1em;
    }
</style>

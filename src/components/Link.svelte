<script lang="ts">
    import { resolve } from "$app/paths";
    import type { Snippet } from "svelte";

    export type LinkProps = {
        href: any;
        children?: Snippet;
        class?: string;
    };
    let props: LinkProps = $props();
</script>

<a href={resolve(props.href)} class={props.class}>
    {@render props.children?.()}
</a>
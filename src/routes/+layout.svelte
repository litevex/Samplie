<script lang="ts">
    import { onMount } from 'svelte';
    import Navbar from '../components/Navbar.svelte';

    let { children, data } = $props();
</script>

<Navbar searchQuery={data.searchQuery}/>

{#if children}
    {@render children()}
{/if}
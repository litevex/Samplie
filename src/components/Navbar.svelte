<script lang="ts">
    import { globalState } from "$lib/state.svelte";

    type NavbarProps = {
        searchQuery: string;
    };
    let props: NavbarProps = $props();
    let alwaysOnTop = $state(false);

    function searchKeydown(event: KeyboardEvent) {
        let input = event.target as HTMLInputElement;
        let query = input.value.trim();

        if (event.key === "Enter") {
            location.href = `/samples?q=${encodeURIComponent(query)}`;
        }
    }

    async function pinButton() {
        alwaysOnTop = !alwaysOnTop;
        await window.electronAPI.setAlwaysOnTop(alwaysOnTop);
    }
</script>
<div class="navbar">
    <div class="left">
        <div class="logo">
            <img class="icon" src="/assets/icon.svg" alt="Samplie Logo" width="14" height="14"/>
            <span>Samplie</span>
        </div>
        <input type="text" value={props.searchQuery} placeholder="Search for samples..." class="search" onkeydown={searchKeydown}/>
    </div>
    <div class="right">
        <button onclick={pinButton} class={alwaysOnTop ? 'enabled' : ''}>
            Pin
        </button>
    </div>
</div>

<style>
    .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: transparent;
        border-bottom: 1px solid var(--border);
        padding: 6px 12px;
        gap: 12px;

        /* Reserve area for title bar @todo: cross platform */
        padding-right: 145px;
        app-region: drag;
        background: rgba(255, 255, 255, 0.04);
    }
    
    .navbar .left {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .navbar .right {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .navbar .logo {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .navbar .search {
        width: 300px;
        app-region: no-drag;
    }

    .navbar button {
        app-region: no-drag;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 2px;
        border: none;
        color: var(--text);
        padding: 4px 8px;
    }

    .navbar button:active {
        background: rgba(255, 255, 255, 0.12);
    }

    .navbar button.enabled {
        background: var(--accent);
        color: #000;
    }

    .navbar button.enabled:active {
        background: var(--accent);
    }
</style>    
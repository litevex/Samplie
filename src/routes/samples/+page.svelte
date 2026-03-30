<script lang="ts">
    import type { SamplePackDto } from "$lib/pack.js";
    import type { SampleDto } from "$lib/sample"
    import { onMount } from "svelte";
    import Sample from "../../components/Sample.svelte";

    let { data } = $props();
    let samplePacks: SamplePackDto[] = $derived(data.samplePacks);
    let samples: SampleDto[] = $derived(Object.values(data.samples || {}));
</script>

<div class="content">
  <span class="title">Samples matching "{data.searchQuery}"</span>
  <div class="sample-list">
    {#each samples as sample}
      <Sample sample={sample} samplePack={samplePacks[sample.samplePack]}/>
    {/each}
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    background: rgb(31, 31, 31);
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }

  .title {
    padding: 14px;

    font-weight: 500;
    font-size: 14px;
    border-bottom: 1px solid var(--border);
  }

  .sample-list {
    display: flex;
    flex-direction: column;
  }
</style>
<script lang="ts">
  import type { SampleDto } from "$lib/sample";
    import { globalState } from "$lib/state.svelte";
  import Link from "../components/Link.svelte";
  import Sample from "../components/Sample.svelte";


</script>

<div class="content">
  <div class="sample-list">
    <span>Search to get started</span>
  </div>
</div>

<style>
  .content {
    background: rgb(31, 31, 31);
    flex: 1;
    box-sizing: border-box;
  }
</style>
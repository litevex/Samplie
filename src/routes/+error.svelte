<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>{page.error?.message || "No error message available"}</h1>
<button onclick={() => history.back()}>Go back</button>
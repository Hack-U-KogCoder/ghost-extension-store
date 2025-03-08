<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<h1>extensions</h1>
{#each data.extensions as ext (ext.id)}
<div class="m-1">
    
    <h2><a href="/extensions/{ext.id.toString()}">{ext.title}</a></h2>
    <div>{ext.id}</div>
    <div>{ext.description}</div>
    <div>{ext.createdAt}</div>
    <div>{ext.updatedAt}</div>
</div>
{/each}
<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
    const ext = data.extension;
</script>

<h1>extension</h1>

<div class="m-1">
    <h2>{ext?.title}</h2>
    <div>{ext?.id}</div>
    <div>{ext?.description}</div>
    <div>{ext?.createdAt}</div>
    <div>{ext?.updatedAt}</div>
</div>
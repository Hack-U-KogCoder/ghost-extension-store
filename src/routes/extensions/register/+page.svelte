<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();
</script>
{#if form?.registered}
<p>
	拡張機能「
	<a href="/extensions/{form?.extension.id.toString()}">
		{form?.extension.title}
	</a>
	」が登録されました
</p>
{:else}
<form method="post" use:enhance>
	<label>
		UserId
		<input value={data.user.id} name="userId" type="hidden" required>
	</label>
    <label>
		title
		<input name="title" type="input" required>
	</label>
    <label>
		description
		<input name="description" type="textarea" required>
	</label>
	<button>新規拡張機能を登録</button>
</form>
{/if}
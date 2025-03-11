<script lang="ts">
	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();
	const ext = data.extension;
</script>

<h1>extension</h1>

{#if form?.success}
	<!-- このメッセージは一時的なものです; form 送信に対するレスポンスとしてページがレンダリングされたため、存在しています。
       ユーザーがリロードすると消えます。 -->
	<p>成功!</p>
{/if}

<div class="m-1">
	<h2>{ext?.title}</h2>
	<div>{ext?.id}</div>
	<div>{ext?.description}</div>
	<div>{ext?.createdAt}</div>
	<div>{ext?.updatedAt}</div>
</div>

<form method="POST" action="?/login">
	<label>
		title
		<input value={ext?.title} name="title" type="input" />
	</label>
	<label>
		description
		<input value={ext?.description} name="description" type="textarea" />
	</label>
	<button formaction="?/update">更新</button>
	<button formaction="?/delete">削除</button>
</form>

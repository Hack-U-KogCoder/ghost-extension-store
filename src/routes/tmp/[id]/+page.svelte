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
	<h2>{ext?.name}</h2>
	<div>{ext?.id}</div>
	<div>{ext?.description}</div>
	<div>{ext?.createdAt}</div>
	<div>{ext?.updatedAt}</div>
</div>

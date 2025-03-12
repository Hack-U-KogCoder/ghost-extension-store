<script lang="ts">
import "../../app.css";
import { enhance } from "$app/forms";
import type { LayoutProps } from "./$types";
let { data, children }: LayoutProps = $props();
</script>

<header class="flex justify-between border-b border-gray-300 p-2 bg-stone-50">
	<h1 class="flex items-center text-4xl text-brand"><a href="/">ghost extension</a></h1>
	<nav class="flex items-center gap-4 font-semibold">
		<div><a class="hover:border-b-2" href="/">ストア</a></div>
		<div><a class="hover:border-b-2" href="/dev">開発</a></div>
		{#if data.user}
			<img src={data.user.githubAvatarUrl} alt="icon" class="rounded-full h-auto w-10" />
			<form method="post" action="/user" use:enhance>
				<button>ログアウト</button>
			</form>
		{:else}
			<div><a href="/login">ログイン</a></div>
		{/if}
	</nav>
</header>
<div class="bg-amber-50 m-0 items-center">
	<div class="container mx-auto">
		<div class="flex flex-col lg:flex-row">
			<div class="m-3 p-2 border-1">
				<h2 class="text-xl font-bold underline"><a href="/">カテゴリー一覧</a></h2>
				{#each data.categories as cat (cat.id)}
					<div>
						<div><a href="/extensions/{cat.name}">{cat.name_JP}</a></div>
					</div>
				{/each}
			</div>
			<div class="m-3">
				{@render children()}
			</div>
		</div>
	</div>
</div>

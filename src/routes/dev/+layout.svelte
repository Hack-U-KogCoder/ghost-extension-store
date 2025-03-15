<script lang="ts">
import "../../app.css";
import { enhance } from "$app/forms";
import type { LayoutProps } from "./$types";
import logo from "$lib/assets/logo.png";
let { data, children }: LayoutProps = $props();
</script>

<div class="bg-amber-50 m-0 min-h-[100vh]">
	<header class="flex justify-between border-b border-gray-300 p-2 bg-stone-50">
		<h1 class=" text-4xl font-bold">
			<a href="/"><img src={logo} alt="Ghost Extension" class="h-[4vh] ml-3" /></a>
		</h1>
		<nav class="flex items-center gap-4 font-semibold">
			<div><a class="hover:border-b-2" href="/">ストア</a></div>
			<div><a class="hover:border-b-2" href="/dev">開発</a></div>
			{#if data.user}
				{data.user.username}
				<img src={data.user.githubAvatarUrl} alt="icon" class="rounded-full h-auto w-10" />
				<form method="post" action="/user" use:enhance>
					<button type="submit">ログアウト</button>
				</form>
			{:else}
				<div><a class="hover:border-b-2" href="/login">ログイン</a></div>
			{/if}
		</nav>
	</header>
	{@render children()}
</div>

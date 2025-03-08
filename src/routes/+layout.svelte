<script lang="ts">
	import "../app.css";
	import { enhance } from "$app/forms";
	import type { LayoutProps } from "./$types";
	let { data, children }: LayoutProps = $props();
</script>
<header class="flex justify-between border-b border-gray-300 p-2">
	<h1 class="flex items-center text-4xl text-brand"><a href="/extensions">ghost extension</a></h1>
<nav class="flex items-center gap-4 font-semibold">
	<div>Page</div>
	<div>Page1</div>
	{#if data.user}
	{data.user.username}
	<img
	src={data.user.githubAvatarUrl} 
	alt="icon"
	class="rounded-full h-auto w-10" 
	/>
	<form method="post" action="/user" use:enhance>
    	<button>ログアウト</button>
	</form>
	{:else}
	<div><a href="/login">ログイン</a></div>
	{/if}
</nav>
</header>
{@render children()}
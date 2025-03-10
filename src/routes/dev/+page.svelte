<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageServerData } from "./$types";
    
    let { data }: { data: PageServerData } = $props();

    function dateToString(date: Date) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}年${m}月${d}日`;
    }

</script>

<h1>開発者向けページ</h1>
{#if !data.user}
<div class="m-2">
    {data.user}
    <p>開発者向けのログインはこちらから</p>
    <form method="post" action="/login?/login_github" use:enhance>
	<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">GitHubでログイン</button>
</form>
</div>
{:else}
<div>
    <a href="/dev/dashboard">あなたのダッシュボード</a>
</div>
{/if}


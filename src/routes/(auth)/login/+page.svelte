<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<h1>ログインページ</h1>
<div class="m-2">
    <p>開発者向けのログインはこちらから</p>
    <form method="post" action="?/login_github" use:enhance>
        <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >GitHubでログイン</button
        >
    </form>
</div>

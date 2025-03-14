<script lang="ts">
import { enhance } from "$app/forms";
import type { PageServerData } from "./$types";

let { data }: { data: PageServerData } = $props();
</script>

<div class="container mx-auto p-5">
    <h1 class="text-3xl mb-3">開発者向けマニュアル</h1>
    {#if !data.user}
        <div class="mb-2">
            {data.user}
            <p>開発者向けのログインはこちらから</p>
            <form method="post" action="/login?/login_github" use:enhance>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >GitHubでログイン</button
                >
            </form>
        </div>
    {:else}
        <div class="mb-3">
            <p>マニュアルは只今準備中です｡ダッシュボードへは下記のリンクからお入りください｡</p>
            <p>
                ダッシュボードでは自身の制作した拡張機能(ゴースト)の確認と登録ができます｡登録の際は､ダッシュボードの登録フォームに拡張機能のGitHubリポジトリのURLを貼り付けてください｡
            </p>
            <p>ご不便をおかけして申し訳ありません｡</p>
        </div>
        <div>
            <a class="text-blue-500 hover:text-blue-700" href="/dev/dashboard">あなたのダッシュボード</a>
        </div>
    {/if}
</div>

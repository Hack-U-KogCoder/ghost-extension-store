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
            <p>
                マニュアルは<span class="font-bold">只今準備中</span
                >です｡ダッシュボードへは下記のリンクからお入りください｡
            </p>
            <p>ご不便をおかけして申し訳ありません｡</p>
        </div>
        <div class="mb-3">
            <a class="text-blue-500 hover:text-blue-700" href="/dev/dashboard">あなたのダッシュボード</a>
        </div>
        <div class="mb-3">
            <h1 class="text-2xl mb-2">使い方</h1>
            <p>ダッシュボードでは自身の制作した拡張機能(ゴースト)の登録と､登録済みゴーストの確認ができます｡</p>
            <p>登録は､登録フォームにGitHubリポジトリのURLを貼り付けてください｡</p>
            <p>「booost-ghost」のトピックが設定されている必要があります｡</p>
            <p>プライベートリポジトリには対応していません｡</p>
        </div>
        <div class="mb-3">
            <h1 class="text-2xl mb-2">ゴーストの開発について</h1>
            <p>
                ゴーストの開発は､
                <a
                    class="text-blue-500 hover:text-blue-700"
                    href="https://github.com/Hack-U-KogCoder/booost-ghost-sample"
                >
                    テンプレートリポジトリ
                </a>をforkのうえ､開発すると便利です｡
            </p>
            <p>TReact/TypeScriptによる開発となります｡</p>
            <p>
                なお､便利な独自APIの用意がありますが､APIドキュメントは未整備です｡こちらの<a
                    class="text-blue-500 hover:text-blue-700"
                    href="https://github.com/Hack-U-KogCoder/booost-ghost-app"
                >
                    リポジトリ</a
                >から Booost 本体のソースコードが閲覧できます｡ご利用ください｡
            </p>
        </div>
    {/if}
</div>

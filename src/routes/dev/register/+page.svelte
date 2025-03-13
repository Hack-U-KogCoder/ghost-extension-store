<script lang="ts">
import { enhance } from "$app/forms";
import type { PageProps } from "./$types";

let { data, form }: PageProps = $props();
</script>

<div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold underline">test</h1>
    {#if data.user}
        <div class="m-2 p-2 size-fit max-w-full border-1 border-solid">
            <h2 class="text-xl font-bold underline">リポジトリ選択</h2>
            <div>リポジトリを入力(URLまたは[ユーザ名]/[リポジトリ名])</div>
            <form method="post" action="?/verify_repo" use:enhance>
                <input
                    class="field-sizing-content max-w-full min-w-full"
                    list="repository-suggestions"
                    value={form?.status?.formRepoName ?? ""}
                    placeholder={`${data.user.username}/hoge または https://github.com/${data.user.username}/hoge`}
                    name="repository-name"
                    autocomplete="off"
                    required
                    disabled={form?.extension !== undefined}
                />
                <datalist id="repository-suggestions">
                    {#if data.suggestions}
                        {#each data.suggestions as suggestion (suggestion.id)}
                            <option value={suggestion.full_name}></option>
                        {/each}
                    {/if}
                </datalist>
                <div>
                    <span class="font-bold text-red-500">{form?.status?.message}</span>
                </div>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-2 px-4 rounded" type="submit"
                    >リポジトリを取得</button
                >
            </form>
        </div>
        {#if form?.extension}
            <div class="m-2 p-2 size-fit max-w-full border-1 border-solid">
                <h2 class="text-xl font-bold underline">リポジトリ情報</h2>
                <div>リポジトリ名: {form?.repository?.name}</div>
                <div>リリース名: {form?.release.name}</div>
                <div>リリースタグ: {form?.release.tag_name}</div>
                <h2 class="text-xl font-bold underline">拡張機能情報</h2>
                <div>名前: {form?.extension.name}</div>
                <div>詳細: {form?.extension.description}</div>
                <div>カテゴリ: {form?.extension.categoryName}</div>
                <div>バージョン: {form?.extension.version}</div>
                <div>
                    <img src={form?.extension.icon_url} alt="アイコン読み込み失敗" />
                </div>
            </div>
            <form method="post" action="?/register_submit" use:enhance>
                <div>
                    <span class="font-bold text-red-500">{form?.status?.message}</span>
                </div>
                <input
                    class="field-sizing-content max-w-full min-w-full"
                    list="repository-suggestions"
                    value={form.repository?.name}
                    name="repository-name"
                    required
                    hidden
                />
                {#if !form?.created}
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-2 px-4 rounded"
                        type="submit">ゴーストを登録する</button
                    >
                {/if}
            </form>
        {/if}
        {#if form?.created}
            <div>ゴーストの登録に成功しました</div>
        {/if}
    {/if}
</div>

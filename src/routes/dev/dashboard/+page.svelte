<script lang="ts">
import { enhance } from "$app/forms";
import type { PageProps } from "./$types";

let { data, form }: PageProps = $props();

function dateToString(date: Date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}年${m}月${d}日`;
}
</script>

<div class="container mx-auto my-3 px-4">
    {#if data.user}
        <h1 class="text-3xl font-bold underline">{data.user.username}のGhostたち</h1>
        <div class="mt-5 mb-8 flex flex-row">
            {#each data.extensions as ext (ext.id)}
                <div
                    class="flex-4 max-w-sm m-5 p-6 bg-white border border-gray-200 rounded-lg
                    shadow-sm"
                >
                    <a href="/extensions/detail/{ext.id.toString()}">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {ext.name}
                        </h5>
                    </a>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {ext.description}
                    </p>
                    <p>最終更新: {dateToString(ext.updatedAt)}</p>
                    <a
                        href="/extensions/detail/{ext.id.toString()}"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium
                        text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        詳細を見る
                        <svg
                            class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </a>
                </div>
            {/each}
            <div
                class="flex-4 max-w-sm m-5 p-6 bg-white border border-gray-200 rounded-lg
                    shadow-sm"
            >
                <h2 class="text-xl mb-3 font-bold underline">ゴーストを登録</h2>
                <div class="mb-2">リポジトリを入力(URLまたは[ユーザ名]/[リポジトリ名])</div>
                <div class="mb-5">
                    <form method="post" action="?/verify_repo" use:enhance>
                        <input
                            class="field-sizing-content mb-3 max-w-full rounded"
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
                        <button
                            class="px-3 py-2 text-sm font-medium
                        text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300"
                            type="submit">リポジトリを取得</button
                        >
                    </form>
                </div>
                {#if form?.extension}
                    <div class="my-3 py-3 border-t-1">
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
                                class="px-3 py-2 text-sm font-medium
                        text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300"
                                type="submit">ゴーストを登録する</button
                            >
                        {/if}
                    </form>
                {/if}
                {#if form?.created}
                    <div>ゴーストの登録に成功しました</div>
                {/if}
            </div>
        </div>
    {/if}
</div>

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
                    <a href="/tmp/detail/{ext.id.toString()}">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {ext.name}
                        </h5>
                    </a>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {ext.description}
                    </p>
                    <form method="POST" action="/tmp/{ext.id}?/delete">
                        <button
                            class="inline-flex items-center px-3 py-2 text-sm font-medium
                        text-center text-white bg-red-700 rounded-lg hover:bg-red-800
                        focus:ring-4 focus:outline-none focus:ring-red-300"
                            type="submit">削除</button
                        >
                    </form>
                </div>
            {/each}
        </div>
    {/if}
</div>

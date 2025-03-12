<script lang="ts">
import type { PageProps } from "./$types";

let { data }: PageProps = $props();

function dateToString(date: Date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}年${m}月${d}日`;
}
</script>

<div><a href="/">戻る</a></div>
<h2 class="text-xl font-bold underline">{data.category.name_JP}</h2>
<div class="w-full flex flex-row flex-wrap">
    {#each data.extensions as ext (ext.id)}
        <div class="m-5 flex-initia">
            <div
                class="p-6 bg-white border border-gray-200 rounded-lg
                        shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
                <img class="w-full h-auto" src={ext.icon_url} alt="イメージ" />
                <a href="/extensions/detail/{ext.id.toString()}">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {ext.name}
                    </h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{ext.description}</p>
                <p>最終更新: {dateToString(ext.updatedAt)}</p>
                <a
                    href="/extensions/detail/{ext.id.toString()}"
                    class="inline-flex items-center px-3 py-2 text-sm
                            font-medium text-center text-white bg-blue-700
                            rounded-lg hover:bg-blue-800 focus:ring-4
                            focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                            dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
        </div>
    {/each}
</div>

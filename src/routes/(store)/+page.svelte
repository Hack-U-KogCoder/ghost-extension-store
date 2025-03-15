<script lang="ts">
import type { PageProps } from "./$types";
import ghost404 from "$lib/assets/ghost404.png";

let { data }: PageProps = $props();

function dateToString(date: Date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}年${m}月${d}日`;
}

function descriptionShorten(description: string) {
  if (description === "") {
    return "説明がありません";
  }

  if (description.length > 35) {
    return description.slice(0, 35) + "...";
  } else {
    return description;
  }
}

function imageCheck(imgurl: string) {
  if (imgurl === "") {
    return ghost404;
  } else {
    return imgurl;
  }
}
</script>

<div class="mb-4 flex gap-2">
  <a href="/" class="text-blue-700 hover:text-blue-400">ストア</a>
</div>
{#each data.extesionsByCategory as cat (cat.id)}
  <div class="mb-15">
    <div class="flex flex-row justify-between">
      <div class="">
        <h2 class="text-2xl font-bold">
          <a href="/extensions/{cat.name}">{cat.name_JP}</a>
        </h2>
      </div>
      <div class="text-blue-700 hover:bg-blue-100 py-1 px-3 rounded-full">
        <a href="/extensions/{cat.name}">もっと見る</a>
      </div>
    </div>
    <div class="w-full flex flex-row flex-wrap">
      {#each cat.extensions as ext (ext.id)}
        <div class="mr-5 mt-3 flex-initia">
          <div class="p-5 bg-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 w-3xs h-[300px]">
            <img
              class="w-full h-1/2 object-cover rounded-lg bg-stone-50"
              src={imageCheck(ext.icon_url)}
              alt="イメージ"
            />
            <a href="/extensions/detail/{ext.id.toString()}">
              <h5 class="my-1 text-2xl font-bold text-gray-900 dark:text-white">
                {ext.name}
              </h5>
            </a>
            <p class="my-1 text-xs text-gray-500">
              最終更新: {dateToString(ext.updatedAt)}
            </p>
            <p class="mt-1 font-normal text-sm text-gray-700 dark:text-gray-400 h-1/6">
              {descriptionShorten(ext.description)}
            </p>

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
  </div>
{/each}

<script lang="ts">
  import type { PageProps } from "./$types";
  import ghost404 from "$lib/assets/ghost404.png";

  let { data }: PageProps = $props();
  const ext = data.extension;

  function dateToString(date: Date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}年${m}月${d}日`;
  }

  function imageCheck(imgurl: string) {
    if (imgurl === "" || imgurl === null) {
      return ghost404;
    } else {
      return imgurl;
    }
  }
</script>

<div class="w-full">
  <div class="mb-4 flex gap-2">
    <a href="/" class="text-blue-700 hover:text-blue-400">ストア</a>
    &gt;
    <a href="/extensions/{ext.category_name}" class="text-blue-700 hover:text-blue-400">
      {ext.category_nameJP}
    </a>
    &gt;
    <a href="/extensions/detail/{ext.id}" class="text-blue-700 hover:text-blue-400">
      {ext.name}
    </a>
  </div>
  <div class="m-1">
    <div class="flex justify-between w-full">
      <div class="text-4xl font-bold">{ext.name}</div>
      <a
        href={(ext.zipball_url === "" || ext.zipball_url === null) ? "/error" : ext.zipball_url}
        class="px-3 py-2 mr-10 font-medium text-center
      text-white bg-blue-700 hover:bg-blue-600
      hover:shadow-md rounded-lg">インストール</a
      >
    </div>
    <div class="flex">
      <div class="flex-col">
        <div class="mt-10">作成日：{dateToString(ext.createdAt)}</div>
        <div>最終更新日：{dateToString(ext.updatedAt)}</div>
      </div>
      <div class="flex ml-40">
        <img class="h-[50vh]" src={imageCheck(ext.icon_url)} alt="イメージ" />
      </div>
    </div>
    <!-- div>{ext?.id}</div !-->
    <div class="mt-10 text-2xl font-bold">概要</div>
    <div class="mt-5">{ext?.description}</div>
  </div>
</div>

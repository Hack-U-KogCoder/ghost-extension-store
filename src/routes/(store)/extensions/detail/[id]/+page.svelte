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

<div class="m-1 flex-col">
  <div class="text-4xl font-bold">{ext.name}</div>
  <img class="w-1/4 h-1/2 absolute top-30 left-150" src={imageCheck(ext.icon_url)} alt="イメージ" />
  <a
    href=""
    class="px-3 py-2 font-medium text-center
         text-white bg-blue-700 hover:bg-blue-600
         hover:shadow-md rounded-lg absolute top-20 right-40">インストール</a
  >
  <!-- div>{ext?.id}</div !-->
  <div class="mt-10">作成日：{dateToString(ext.createdAt)}</div>
  <div>最終更新日：{dateToString(ext.updatedAt)}</div>
  <div class="mt-60 text-2xl font-bold">概要</div>
  <div class="mt-5">{ext?.description}</div>
</div>

<script lang="ts">
import "../../app.css";
import { enhance } from "$app/forms";
import type { LayoutProps } from "./$types";
import logo from "$lib/assets/logo.png";
let { data, children }: LayoutProps = $props();
</script>

<header class="flex justify-between border-b border-gray-300 p-2 bg-stone-50 min-h-[6vh]">
  <h1 class=" text-4xl font-bold">
    <a href="/"><img src={logo} alt="ロゴ" class="h-[4vh] ml-3" /></a>
  </h1>
  <nav class="flex items-center gap-4 font-semibold mr-3">
    <div><a class="hover:border-b-2" href="/">ストア</a></div>
    <div><a class="hover:border-b-2" href="/dev">開発</a></div>
    {#if data.user}
      <img src={data.user.githubAvatarUrl} alt="icon" class="rounded-full h-auto w-10" />
      <form method="post" action="/user" use:enhance>
        <button>ログアウト</button>
      </form>
    {:else}
      <div><a href="/login">ログイン</a></div>
    {/if}
  </nav>
</header>
<div class="bg-stone-50 m-0 pt-3 min-h-[94vh]">
  <div class="container">
    <div class="flex flex-col lg:flex-row">
      <div class="my-3 ml-3 mr-20 p-2 min-w-[150px]">
        <h2 class="text-xl font-bold">
          <a href="/">カテゴリー一覧</a>
        </h2>
        {#each data.categories as cat (cat.id)}
          <div class="my-4">
            <div><a href="/extensions/{cat.name}">{cat.name_JP}</a></div>
          </div>
        {/each}
      </div>
      <div class="m-3 w-full">
        {@render children()}
      </div>
    </div>
  </div>
</div>

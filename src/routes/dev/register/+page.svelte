<script lang="ts">
    import { enhance } from "$app/forms";
	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();
</script>
<div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold underline">test</h1>
    {#if data.user }
    <div class="m-2 p-2 size-fit max-w-full border-1 border-solid">
        <h2 class="text-xl font-bold underline">リポジトリ選択</h2>
        <div>リポジトリを入力(URLまたは[ユーザ名]/[リポジトリ名])</div>
        <form method="post" action="?/verify_repo" use:enhance>
            <input 
                class="field-sizing-content max-w-full min-w-full"
                list="repository-suggestions"
                value={form?.repository.name ?? ""}
                name="repository-name"
                autocomplete="off"
                required/>
            <datalist id="repository-suggestions">
                {#if data.suggestions}
                {#each data.suggestions as suggestion}
                <option value="{suggestion.full_name}"></option>
                {/each}
                {/if}
            </datalist>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-2 px-4 rounded"
                type="submit">リポジトリを取得</button>
        </form>
    </div>

    <div class="m-2 p-2 size-fit max-w-full border-1 border-solid">
        <h2 class="text-xl font-bold underline">最新のリリース取得</h2>
        <div><pre class="whitespace-pre-wrap">{JSON.stringify(form?.release, null, "\t")}</pre></div>
    </div>
    <div class="m-2 p-2 size-fit max-w-full border-1 border-solid">
        <h2 class="text-xl font-bold underline">マニフェスト取得</h2>
        <div><pre class="whitespace-pre-wrap">{JSON.stringify(form?.manifest, null, "\t")}</pre></div>
    </div>
    {/if}
</div>
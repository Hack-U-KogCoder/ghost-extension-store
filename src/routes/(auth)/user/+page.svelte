<script lang="ts">
	import { enhance } from "$app/forms";
    import type { PageServerData } from "./$types";

    let { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<img
    src={data.user.githubAvatarUrl} 
    alt="icon"
    class="mt-6 rounded-full h-auto w-16" 
    />
<form method="post" use:enhance>
    <button>ログアウト</button>
</form>
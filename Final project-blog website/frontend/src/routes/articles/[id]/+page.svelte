<script>
  
  export let data;
  import CommentsLogout from "$lib/components/CommentsLogout.svelte";
  import CommentsLogin from "$lib/components/CommentsLogin.svelte";
  import CommentsDeleteAll from "$lib/components/CommentsDeleteAll.svelte";
  import { page } from "$app/stores";

  $: {
  if (!data) {
    console.error("Data is missing or failed to load.");
    // 可以显示加载中或错误信息
  }
  }

  $: article = data?.article; 
  $: id = article?.id;
  $: author = article?.username;
  $: isLoggedIn = data?.isLoggedIn; 
  $: user = data?.user;
  $: name = user?.name;
  
</script>

{#if article}
  <h1>{article.article_title}</h1>
  <h3>Author: {article.username}</h3>
  <p>{article.content}</p>
  <p>{article.createdAt}</p>
{:else}
  <p>Loading...</p>
{/if}


{#if isLoggedIn && name == author} 
  {#if article && id && user}
    <CommentsDeleteAll user={user} articleId={id} />
  {:else}
    <p>Loading...</p>
  {/if}
{/if}


{#if isLoggedIn && name != author} 
  {#if article && id && user}
    <CommentsLogin user={user} articleId={id} />
  {:else}
    <p>Loading...</p>
  {/if}
{/if}





{#if !isLoggedIn} 
  {#if id}
    <CommentsLogout articleId={id} />
  {:else}
    <p>Loading...</p>
  {/if}
{/if}

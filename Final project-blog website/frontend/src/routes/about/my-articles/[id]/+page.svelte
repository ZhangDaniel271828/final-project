<script>
  export let data;
  import CommentsDeleteAll from "$lib/components/CommentsDeleteAll.svelte";
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import { goto } from "$app/navigation";


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
  $: name = user?.username;
  
  async function deleteArticle(){
    try {
      const response = await fetch(`${ARTICLES_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert("Article deleted successfully");
        await invalidateAll();
        goto("/about/my-articles");
        
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article!');
    }
    

  }



</script>

{#if article}
  <h1>{article.article_title}</h1>
  <h3>Author: {article.username}</h3>
  <p>{article.content}</p>
  <p>{article.createdAt}</p>
  <span><button on:click = {deleteArticle}>Delete my article</button></span>
  <br>
  <br>

{:else}
  <p>Loading...</p>
{/if}

<!-- 是自己的文章，可以随便删评论 -->
{#if isLoggedIn && name == author} 
  {#if article && id && user}
    <CommentsDeleteAll user={user} articleId={id} />
  {:else}
    <p>Loading...</p>
  {/if}
{/if}


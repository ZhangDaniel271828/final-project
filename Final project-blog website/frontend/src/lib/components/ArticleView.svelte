<script>
  export let articleId;
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import { onMount } from "svelte";

  let article = null;
  async function fetchArticle(articleId) {
  try {
    const response = await fetch(`${ARTICLES_URL}/${articleId}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    });
    if (!response.ok) {
      throw new Error("can't get article");
    }
    article = await response.json(); 
    console.log(article);
    } catch (error) {
      console.error("error", error);
    }
  }
  onMount(fetchArticle(articleId));

</script>


<div class="article-view">
  {#if article}
    <!-- article加载完成后渲染 -->
    <h1>{article.article_title}</h1>
    <p>{article.content}</p>
  {:else}
    <!-- article未加载完成时显示加载提示 -->
    <p>加载中...</p>
  {/if}
</div>



<style>
  .article-view {
    width: 55%;
    padding: 20px;
    background: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-left: 500px;
    margin-top: -200px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    color: #080606;
  }
 
  
</style>












 


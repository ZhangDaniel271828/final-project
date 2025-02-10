<script>
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  //Get user's Article
  export let data;
  const userId = data.user.id;
  export let articles = [];
  async function fetchArticles() {
    try {
      const response = await fetch(`${ARTICLES_URL}/author/${userId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      });
      if (!response.ok) {
        throw new Error("can't get articles");
      }
      articles = await response.json(); 
      } catch (error) {
        console.error("error", error);
      }
  }
  onMount(fetchArticles);
  $:data,fetchArticles();




  async function sortByAuthor() {
  try {
      const response = await fetch(`${ARTICLES_URL}/author/${userId}?sortBy=username`, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
      });

    if (!response.ok) {
      throw new Error("can't get articles");
    }
    articles = await response.json(); 
    console.log(articles);

    } catch (error) {
      console.error("error", error);
    }
  }  
  async function sortByTitle() {
  try {
      const response = await fetch(`${ARTICLES_URL}/author/${userId}?sortBy=article_title`, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
      });

    if (!response.ok) {
      throw new Error("can't get articles");
    }
    articles = await response.json(); 
    console.log(articles);

    } catch (error) {
      console.error("error", error);
    }
  }  
</script>



<div class="layout">
  <nav class="nav">
    <h1>This is my Articles</h1>
    <button on:click={() => fetchArticles()}>Sort articles by time</button>
    <button on:click={() => sortByAuthor()}>Sort articles by author</button>
    <button on:click={() => sortByTitle()}>Sort articles by title</button>
    {#each articles as article}
        <a href={`/about/my-articles/${article.id}`}>{article.article_title}</a>
    {/each}
  </nav>

  <main class="content">
    <slot /> 
  </main>
</div>


<style>
  .layout {
    display: flex;         /* 使用 flex 布局 */
    margin-top: 60px;
  }

  .nav {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width:30%;
    margin-left: -100px;
  }

  a {
    color: white;
    text-decoration: none;
    padding: 8px 12px;
    background-color: #997fde;
    border-radius: 5px;
    
  }

  .content {
    background-color: #f4f4f4;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    flex-grow: 1;
    padding: 20px;
    margin-left: 20px; /* 让文章内容和导航栏之间增加 20px 间距 */
  }
</style>









<script>
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  //Get all Article
  export let articles = [];
  async function getAllArticles() {
    try {
      const response = await fetch(ARTICLES_URL, {
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
  onMount(getAllArticles);

  async function sortByAuthor() {
  try {
      const response = await fetch(`${ARTICLES_URL}?sortBy=username`, {
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
      const response = await fetch(`${ARTICLES_URL}?sortBy=article_title`, {
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

  let search = "";

  function filter (search){
    if(search != ""){
      articles = articles.filter(article => 
      article.article_title.toLowerCase().includes(search.toLowerCase())
      );
    }else{
    getAllArticles();
  }
  }
  $:filter(search);

</script>



<div class="layout">
  <nav class="nav">
    <button on:click={() => getAllArticles()}>Sort articles by time</button>
    <button on:click={() => sortByAuthor()}>Sort articles by author</button>
    <button on:click={() => sortByTitle()}>Sort articles by title</button>
    <label for="search">Search</label>
    <input type="text" name = "search"   bind:value={search}>

    {#each articles as article}
        <a href={`/articles/${article.id}`}>{article.article_title}</a>
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















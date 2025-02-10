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
</script>

<div class="container">
  <slot />
</div>


<nav>
  {#each articles as article}
      <a href={`/articles/${article.id}`}>{article.article_title}</a>
  {/each}
</nav>


<style>
  .container{
    margin-left:-200px;
  }

  nav {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width:30%;
      background-color: #c6c5c8;
      margin-left: -100px;
  }

  a {
      color: white;
      text-decoration: none;
      padding: 8px 12px;
      background-color: #997fde;
      border-radius: 5px;
  }

  a:hover {
      background-color: #05c2df;
  }
  </style>







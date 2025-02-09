<script>
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  export let data;
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";


  //Get user's Article
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


</script>

<h1>My Article List</h1>

<nav>
  <button on:click={()=>goto("/about/myArticles/post")} style="font-size: 20px; padding: 15px 30px;">Let's post an article!</button>
  {#each articles as article}
      <a href={`/about/myArticles/${article.id}`}>{article.article_title}</a>
  {/each}
</nav>
  


<slot />



<style>
  h1{
    margin-left: -30px;

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






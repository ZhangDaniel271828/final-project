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
        headers: { "Content-Type": "application/json" }
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
  $: data, fetchArticles();

  // sort article by author
  async function sortByAuthor() {
    try {
      const response = await fetch(`${ARTICLES_URL}/author/${userId}?sortBy=username`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
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

  // sort article by title
  async function sortByTitle() {
    try {
      const response = await fetch(`${ARTICLES_URL}/author/${userId}?sortBy=article_title`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
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

  //filter article by key words
  let search = "";
  function filter(search) {
    if (search != "") {
      articles = articles.filter((article) =>
        article.article_title.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      fetchArticles();
    }
  }
  $: filter(search);
</script>



<svelte:head>
  <title>My Articles</title>
</svelte:head>

<!-- nav bar of my articles -->
<div class="layout">
  <nav class="nav">
    <h1>This is my Articles</h1>
    <button
      on:click={() => goto("/about/my-articles/post")}
      style="font-size: 20px; padding: 15px 30px;">Let's post an article!
    </button>

    <button on:click={() => fetchArticles()}>Sort articles by time</button>
    <button on:click={() => sortByAuthor()}>Sort articles by author</button>
    <button on:click={() => sortByTitle()}>Sort articles by title</button>
    <label for="search">Search</label>
    <input type="text" name="search" bind:value={search} />
    {#each articles as article}
      <a href={`/about/my-articles/${article.id}`}>{article.article_title}</a>
    {/each}
  </nav>

  <main class="content">
    <slot />
  </main>
</div>


<!-- css part -->
<style>
  .layout {
    display: flex; 
    margin-top: 60px;
  }

  .nav {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 30%;
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
    margin-left: 20px; 
  }
</style>

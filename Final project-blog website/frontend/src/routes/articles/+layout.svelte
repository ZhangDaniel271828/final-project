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
  onMount(getAllArticles);
  //Sort articles by author
  async function sortByAuthor() {
    try {
      const response = await fetch(`${ARTICLES_URL}?sortBy=username`, {
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

  //Sort articles by title
  async function sortByTitle() {
    try {
      const response = await fetch(`${ARTICLES_URL}?sortBy=article_title`, {
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

  //Search articles
  let search = "";
  function filter(search) {
    if (search != "") {
      articles = articles.filter((article) =>
        article.article_title.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      getAllArticles();
    }
  }
  $: filter(search);
</script>

<!-- Nav bar for my articles  -->
<div class="layout">
  <nav class="nav">
    <button on:click={() => getAllArticles()}>Sort articles by time</button>
    <button on:click={() => sortByAuthor()}>Sort articles by author</button>
    <button on:click={() => sortByTitle()}>Sort articles by title</button>
    <label for="search">Search</label>
    <input type="text" name="search" bind:value={search} />

    {#each articles as article}
      <a href={`/articles/${article.id}`}>{article.article_title}</a>
    {/each}
  </nav>

  <main class="content">
    <slot />
  </main>
</div>

<!-- Css part -->
<style>
  .layout {
    display: flex;
    margin-top: 60px;
    background: #f8f9fa;
    min-height: 100vh;
  }

  .nav {
    background: #2d3748;
    padding: 2rem;
    width: 300px;
    min-height: 100vh;
    position: sticky;
    left: 0;
    top: 0;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    z-index: 90;
  }

  .nav {
    background: #2d3748;
    padding: 2rem;
    width: 20%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    top: 10%;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
    color: white;
  }

  .nav button {
    background: linear-gradient(135deg, #ffd6e7 0%, #2d3748 100%);
    border: none;
    padding: 1rem;
    color: #2d3748;
    border-radius: 1rem;
    margin: 0.5rem 0;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav button::before {
    content: "➤";
    transition: transform 0.3s ease;
    color: #ffd6e7;
  }

  .nav button:hover {
    transform: translateX(10px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .nav button:hover::before {
    transform: rotate(90deg);
  }

  .content {
    margin-left: 300px;
    padding: 3rem;
    background: white;
    min-height: 100vh;
    width: calc(100% - 300px);
  }

  a {
    display: block;
    padding: 1rem;
    background: rgba(255, 214, 231, 0.1); /* using #ffd6e7 with transparency */
    border-radius: 1rem;
    margin: 0.5rem 0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    color: white;
    text-decoration: none;
  }

  a::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: #ffd6e7;
    transition: width 0.3s ease;
  }

  a:hover {
    background: rgba(255, 214, 231, 0.2);
    transform: translateX(10px);
  }

  a:hover::before {
    width: 100%;
  }

  input[type="text"] {
    background: rgba(255, 214, 231, 0.1);
    border: 2px solid rgba(255, 214, 231, 0.3);
    color: white;
    padding: 1rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
  }

  input[type="text"]:focus {
    background: rgba(255, 214, 231, 0.2);
    border-color: #ffd6e7;
  }
</style>

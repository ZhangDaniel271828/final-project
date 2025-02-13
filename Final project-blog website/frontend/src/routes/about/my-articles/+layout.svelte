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
    <button
      on:click={() => goto("/about/my-articles/post")}
      style="font-size: 20px; padding: 15px 30px;"
      >Let's post an article!
    </button>
    <button on:click={() => fetchArticles()}>Sort articles by time</button>
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
    min-height: 100vh;
  }

  .nav {
    background: #7b7b7b;
    padding: 2rem;
    width: 20%;
    height: 100vh; 
    position: fixed;
    left: 0;
    top: 10%;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
    color: white;
    display: flex;
    flex-direction: column;
    z-index: 90;
    overflow-y: auto; 
    align-items: center;
    justify-content: flex-start;
  }

  .content {
    margin-left: 300px;
    padding: 3rem;
    background: #f7eaec;
    min-height: 100vh;
    width: calc(100% - 300px);
  }

  .nav button {
    background: linear-gradient(135deg, #f7eaec 0%, #2d3748 100%);
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
    width: 100%;
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

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(255, 214, 231, 0.1); /* Background color with transparency */
    border-radius: 1rem;
    margin: 0.5rem 0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    color: white; /* Default text color */
    text-decoration: none;
    white-space: nowrap; /* Ensure text stays on one line */
    overflow: hidden; /* Hide overflow */
    text-overflow: ellipsis; /* Show ellipsis for overflowed text */
    width: 100%;
  }

  a:hover {
    background: rgba(255, 214, 231, 0.2); /* Slightly darker background on hover */
    transform: translateX(10px);
  }

  a:hover::before {
    width: 100%;
  }

  a:hover {
    color: #2d3748; /* Dark text color on hover */
  }

  input[type="text"] {
    background: rgba(255, 214, 231, 0.1);
    border: 2px solid rgba(255, 214, 231, 0.3);
    color: white;
    padding: 1rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
    width: 100%;
  }

  input[type="text"]:focus {
    background: rgba(255, 214, 231, 0.2);
    border-color: #ffd6e7;
  }


  @media (max-width: 768px) {
    .nav {
      width: 100%;
      position: static;
    }
    .content {
      margin-left: 0;
    }
  }
</style>

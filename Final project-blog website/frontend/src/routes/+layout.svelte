<script>
  import "$lib/css/app.css";
  import { AUTH_UOT } from "$lib/js/api-urls.js";
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";


  $: path = $page.url.pathname;
  $: console.log(path);
  export let data;
  

  /**
   * Handle logout by sending a DELETE request to /api/auth, then invalidating.
   */
  export async function handleLogout() {
    const response = await fetch(AUTH_UOT, {
    method: "DELETE",
    credentials: "include"
    });
    await invalidateAll();
    goto('/login');
  }
</script>

<nav>
  <ul>
    <li><a href="/" class:active={path === "/"}>Home</a></li>
    <li><a href="/login/register" class:active={path === "/login/register"}>Register</a></li>
    <li><a href="/articles" class:active={path === "/articles"}>All Articles</a></li>

    {#if data.isLoggedIn}
      <li><a href="/about" class:active={path === "/about"}>About me</a></li>
      <li><a href="/about/my-articles" class:active={path === "/about/my-articles"}>My Articles</a></li>
    {/if}
  </ul>
  <span />
  <ul>
    <!-- Display the login link OR the logout button, not both. -->
    {#if data.isLoggedIn}
      <li><button on:click={handleLogout}>Logout</button></li>
    {:else}
      <li><a href="/login" class:active={path.startsWith("/login")}>Login</a></li>
    {/if}
  </ul>
</nav>

<div class="container">
  <slot />
</div>

<style>
  nav {
    background-color: rgb(42, 139, 70);
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 0 5px 3px lightgray;
    display: flex;

    & > ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 10px;
    }

    & li {
      padding: 10px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    & :is(a, button) {
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      text-decoration: none;
      background-color: transparent;
      border: 0;
      padding: 0;
      font-family: inherit;
      cursor: pointer;

      &.active {
        text-decoration: underline;
      }
    }

    & > span {
      flex-grow: 1;
    }
  }

  .container {
    width: 1200px;
    margin: 0 auto;

    @media (max-width: 1200px) {
      width: 100%;
    }
  }
</style>

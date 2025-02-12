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

  //Handle logout by sending a DELETE request to /api/auth, then invalidating.
  export async function handleLogout() {
    const response = await fetch(AUTH_UOT, {
      method: "DELETE",
      credentials: "include"
    });
    await invalidateAll();
    goto("/login");
  }
</script>

<!-- nav bar for website -->
<nav>
  <ul>
    <li><a href="/" class:active={path === "/"}>Home</a></li>
    <li><a href="/articles" class:active={path === "/articles"}>All Articles</a></li>

    {#if data.isLoggedIn}
      <li><a href="/about" class:active={path === "/about"}>About me</a></li>
      <li>
        <a href="/about/my-articles" class:active={path === "/about/my-articles"}>My Articles</a>
      </li>
    {/if}
  </ul>
  <span />
  <ul class="auth-links">
    {#if data.isLoggedIn}
      <li><button on:click={handleLogout}>Logout</button></li>
    {:else}
      <li><a href="/login" class:active={path.startsWith("/login")}>Login</a></li>
      <li><a href="/login/register" class:active={path === "/login/register"}>Register</a></li>
    {/if}
  </ul>
</nav>

<div class="container">
  <slot />
</div>

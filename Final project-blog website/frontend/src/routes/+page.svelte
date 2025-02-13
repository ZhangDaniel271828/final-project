<script>
  export let data;
  import PopularArticles from "$lib/components/PopularArticles.svelte";
</script>

<svelte:head>
  <title>Authentication lab - Home</title>
</svelte:head>

<div class="container">
  {#if data.isLoggedIn}
    <h2>Hi {data.user.firstName}! Welcome to your personalized homepage!</h2>
  {:else}
    <h2>Hi there! Please login to see your personalized homepage.</h2>
  {/if}
  <PopularArticles />
</div>

<style>
  h2 {
    color: transparent;
    background: linear-gradient(
      15deg,
      rgba(50, 50, 100, 0.9) 20%,
      rgba(100, 100, 150, 0.7) 50%,
      rgba(150, 150, 200, 0.9) 80%
    );
    -webkit-background-clip: text;
    background-clip: text;
    text-shadow:
      0 0 12px rgba(100, 100, 150, 0.3),
      1px 1px 1px rgba(150, 150, 200, 0.8);
    position: relative;
  }
</style>

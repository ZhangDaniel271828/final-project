<script>
  export let data;
</script>

<svelte:head>
  <title>Authentication lab - Home</title>
</svelte:head>

<h1>Home</h1>

{#if data.isLoggedIn}
  <p>Hi {data.user.firstName}! Welcome to your personalized homepage!</p>
{:else}
  <p>Hi there! Please login to see your personalized homepage.</p>
{/if}

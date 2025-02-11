<script>
    import Postarticles from "$lib/components/Postarticles.svelte";
    export let data;
  </script>
  
  <svelte:head>
    <title>Post an article</title>
  </svelte:head>
  
  
  {#if data.user}
    <Postarticles user={data.user} />
  {/if}
  
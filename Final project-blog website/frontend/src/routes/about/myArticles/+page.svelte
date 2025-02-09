<script>
  import LinkList from "$lib/components/Comments.svelte";
  export let data;
</script>



<h1>Article Page</h1>

<LinkList user={data.user} Comments/>
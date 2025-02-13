<script>
  import UserInfoForm from "$lib/components/UserInfoForm.svelte";

  export let data;
</script>

<svelte:head>
  <title>About me</title>
</svelte:head>

<h1>About me</h1>

{#if data.user}
  <UserInfoForm user={data.user} />
{/if}

<style>
  h1 {
      text-align: center;
      background-color: #7b7b7b;
      color: #f7eaec;
      border-radius: 15px;
  }
</style>

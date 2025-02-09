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

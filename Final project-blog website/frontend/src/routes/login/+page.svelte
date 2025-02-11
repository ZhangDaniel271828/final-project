<script>
import { goto } from '$app/navigation'; 
import { AUTH_LOGIN } from "$lib/js/api-urls.js";
import { invalidateAll } from "$app/navigation";
import bcrypt from 'bcryptjs';

  let username = "";
  let password = "";
  let error = false;
  async function handleSubmit() {
    error = false;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const response = await fetch(AUTH_LOGIN, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, hashedPassword })
    });

    if (response.status === 401) {
      error = true;
    } else {
      goto("/");
      await invalidateAll();

    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<h1>Login</h1>

<form on:submit|preventDefault={handleSubmit}>
  <label for="username">Username:</label>
  <input type="text" name="username" bind:value={username} required />
  <label for="password">Password:</label>
  <input type="password" name="password" bind:value={password} required />
  <button type="submit">Login</button>
  {#if error}
    <span class="error">Could not log in with those credentials, please try again.</span>
  {/if}
</form>

<div class = "goToRegister">
<button on:click={()=>goto("login/register")} >Go to Register</button>
</div>


<style>
  form {
    margin: auto;
    max-width: 500px;
    border: 1px dashed green;
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  button {
    grid-column: 1 / 3;
  }

  .error {
    grid-column: 1 / 3;
    font-weight: bold;
    color: darkred;
    background-color: lightcoral;
    padding: 5px;
    text-align: center;
  }

  .goToRegister {
		margin: auto;
		max-width: 500px;
		border: 1px dashed green;
		padding: 10px;
		display: grid;
		grid-template-columns:1fr;
	}
</style>

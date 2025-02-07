<script>
	import { goto } from '$app/navigation'; 
	import { AUTH_URL } from "$lib/js/api-urls.js";

	let username = "";
	let password = "";
	let repeatPassword = "";
	let error = false;

</script>
	
<svelte:head>
	<title>Register Page</title>
</svelte:head>

<h1>Register</h1>

<form>
	<div class = "firstPart">
		<label for="username">Username:</label>
		<input type="text" name="username" bind:value={username} required />

		<label for="password">Password:</label>
		<input type="password" name="password" bind:value={password} required />

		<label for="repeatPassword">Repeat password:</label>
		<input type="password" name="repeatPassword" bind:value={repeatPassword} required />
		{#if password != repeatPassword && repeatPassword !=""}
		<br>
		<span class = "error">Passwords must match!</span>
		{/if}









		
		{#if error}
		<span class="error">Could not log in with those credentials, please try again.</span>
		{/if}
	</div>






	<button type="submit">Register</button>




	</form>
	
	<button on:click={()=>goto("/login")} >Login</button>
	
<style>
	.firstPart {
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
		color: rgb(240, 2, 2)	  
	}
</style>
	
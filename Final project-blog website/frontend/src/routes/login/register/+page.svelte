<script>
	import { goto } from '$app/navigation'; 
	import { AUTH_URL } from "$lib/js/api-urls.js";

	//fomr variables
	let username = "";
	let password = "";
	let repeatPassword = "";
	let birthDate = "";
	let lastName = "";
	let firstName = "";
	let blurb = "";

// avator variables and function
	let selectedImage = null;
	let avatarPreview ="";
	let file = null;
	//Save the unploaded avatar data into the file variable and preview the image.
	function handleFileChange(event) {
		selectedImage = null;
		file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				avatarPreview = reader.result; 
				};
			reader.readAsDataURL(file);
		}
	}
	//if user select default img, clear the uploaded custom avatar data.
	$:clearUploadedData(selectedImage);
	function clearUploadedData(){
		avatarPreview = "";
		file = null;
	}


</script>
	

<!-- HTML part -->
<svelte:head>
	<title>Register Page</title>
</svelte:head>

<h1>Register</h1>

<!-- this is a form -->
<form>
	<!-- baisc form -->
	<div class = "basic-form">
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


		<label for="firstName">Frist Name:</label>
		<input type="text" name="firstName" bind:value={firstName} required />

		<label for="lastName">Last Name:</label>
		<input type="text" name="lastName" bind:value={lastName} required />

		<label for="birthDate">Date of Birth:</label>
		<input type="text" name="birthDate" bind:value={birthDate} required />

	</div>

	<!-- blurb form -->
	<div class = "blurb-form">
		<label for="blurb">Please introduce yourself:</label>
		<textarea name = "blurb" bind:value={blurb} rows="12" required />
	</div>

	<!-- avatar fomr -->
	<div class = "avatar-form">
		<!-- select a default avatar -->
		<p>Please choose a default avatar: </p>
		<div class = "avatar-form-span">
			<label class = "label-img">
				<img class="selectedImg" src="/default1.png" alt="defaultAvatar1" />
				<br>
				<input type="radio" name="image" value="default1.png" bind:group={selectedImage} />
			</label>

			<label class = "label-img">
				<img class="selectedImg" src="/default2.png" alt="defaultAvatar2" />
				<br>
				<input type="radio" name="image" value="default2.png" bind:group={selectedImage} />
			</label>

			<label class = "label-img">
				<img class="selectedImg" src="/default3.png" alt="defaultAvatar3" />
				<br>
				<input type="radio" name="image" value="default3.png" bind:group={selectedImage} />
			</label>

			<label class = "label-img">
				<img class="selectedImg" src="/default4.png" alt="defaultAvatar4" />
				<br>
				<input type="radio" name="image" value="default4.png" bind:group={selectedImage} />
			</label>
		</div>

		<!-- Upload a custom avatar -->
		<p>------------------------------------------------------------------------------</p>
		<p>Or upload a custom avatar (no more than 200K): </p>
		<input type="file" accept="image/*"  on:change={handleFileChange}>
		<br>
		{#if avatarPreview}
		<img src={avatarPreview} alt="preview avatar" height="150px">
		<p>Wow, your avatar looks cool!</p>
		{/if}

		<button type="submit">Submit</button>

	</div>

</form>

<!-- this a goToLogin button -->
<div class = "goToLogin">
	<p>If I have an account?</p>
	<button on:click={()=>goto("/login")} >Go to Log In</button>
</div>


<!-- CSS part -->
<style>
	.basic-form {
		margin: auto;
		max-width: 500px;
		border: 1px dashed green;
		padding: 10px;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 10px;
	}
	.blurb-form {
		margin: auto;
		max-width: 500px;
		border: 1px dashed green;
		padding: 10px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.selectedImg {
		height:100px;
	}
	.avatar-form {
		margin: auto;
		max-width: 500px;
		border: 1px dashed green;
		padding: 10px;
		display: grid;
		grid-template-columns:1fr;
		gap: 1px;
	}
	.avatar-form-span {
		display: grid;
		grid-template-columns:1fr 1fr 1fr 1fr;
		gap: 10px;
	}

	.goToLogin {
		margin: auto;
		max-width: 500px;
		border: 1px dashed green;
		padding: 10px;
		display: grid;
		grid-template-columns:1fr;
	}
	.error {
		color: rgb(240, 2, 2)	  
	}
</style>
	
<script>
	import { goto } from '$app/navigation';
	import { USER_REGISTER, CHECK_USERNAME, USER_ME } from "$lib/js/api-urls.js"; 
	import bcrypt from 'bcryptjs';

	// form variables
	let username = "";
	let password = "";
	let repeatPassword = "";
	let realName = "";
	let birthDate = "";
	let blurb = "";
	let usernameExists = false; 

	// avatar variables and function
	let selectedImage = null;
	let avatarPreview = "";
	let file = null;

	// Save the uploaded avatar data into the file variable and preview the image.
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

	// If user selects default img, clear the uploaded custom avatar data.
	$: clearUploadedData(selectedImage);
	function clearUploadedData() {
		avatarPreview = "";
		file = null;
	}

	//check if username exists
	async function checkUsername() {
    if (username) {
        try {
            const response = await fetch(`${CHECK_USERNAME}?username=${username}`);
            if (!response.ok) { // check status code
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            usernameExists = !data.available;
        } catch (error) {
            console.error("Error checking username:", error);
            usernameExists = false;
        }
    } else {
        usernameExists = false;
    }
}

	// Handle register
	async function registerUser() {

		const hashedPassword = bcrypt.hashSync(password, 10);

		console.log({ username, password, realName, birthDate, blurb });

		console.log("Before checking usernameExists in registerUser:", usernameExists); // Debugging line

		if (usernameExists) {
			alert("Username already exists. Please choose a different username.");
			return;
		}

		try {
			const response = await fetch(USER_REGISTER, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ username, password: hashedPassword, realName, birthDate, blurb })
			});

			if (response.status === 201) {
				alert("Success! Please Log in");
				goto("/login");
			}
			if (response.status === 400) {
				alert("Missing required fields");
			}

		} catch (error) {
			alert("Error!");
		}
	}

	// Function to fetch user details
	async function fetchUserDetails() {
		const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
		if (!token) {
			alert("Please log in first.");
			goto("/login");
			return;
		}

		try {
			const response = await fetch(USER_ME, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});

			if (response.status === 401) {
				alert("Unauthorized. Please log in again.");
				goto("/login");
			} else if (response.ok) {
				const user = await response.json();
				console.log("User details:", user);
			} else {
				alert("Failed to fetch user details.");
			}
		} catch (error) {
			console.error("Error fetching user details:", error);
			alert("Error fetching user details.");
		}
	}

</script>

<!-- HTML part -->
<svelte:head>
	<title>Register Page</title>
</svelte:head>

<h1>Register</h1>

<!-- this is a form -->
<form on:submit|preventDefault={registerUser}>
	<!-- basic form -->
	<div class="basic-form">
		<label for="username">Username:</label>
		<input type="text" name="username" bind:value={username} required on:change={checkUsername} />

		{#if usernameExists}
		<br>
		<span class="error">Username already exists. Please choose a different username.</span>
		{/if}

		<label for="password">Password:</label>
		<input type="password" name="password" bind:value={password} required />

		<label for="repeatPassword">Repeat password:</label>
		<input type="password" name="repeatPassword" bind:value={repeatPassword} required />
		{#if password != repeatPassword && repeatPassword != ""}
		<br>
		<span class="error">Passwords must match!</span>
		{/if}

		<label for="realName">Real Name:</label>
		<input type="text" name="realName" bind:value={realName} required />

		<label for="birthDate">Date of Birth:</label>
		<input type="text" name="birthDate" bind:value={birthDate} required />
	</div>

	<!-- blurb form -->
	<div class="blurb-form">
		<label for="blurb">Please introduce yourself:</label>
		<textarea name="blurb" bind:value={blurb} rows="12" required />
	</div>

	<!-- avatar form -->
	<div class="avatar-form">
		<!-- select a default avatar -->
		<p>Please choose a default avatar: </p>
		<div class="avatar-form-span">
			<label class="label-img">
				<img class="selectedImg" src="/default1.png" alt="defaultAvatar1" />
				<br>
				<input type="radio" name="image" value="default1.png" bind:group={selectedImage} />
			</label>

			<label class="label-img">
				<img class="selectedImg" src="/default2.png" alt="defaultAvatar2" />
				<br>
				<input type="radio" name="image" value="default2.png" bind:group={selectedImage} />
			</label>

			<label class="label-img">
				<img class="selectedImg" src="/default3.png" alt="defaultAvatar3" />
				<br>
				<input type="radio" name="image" value="default3.png" bind:group={selectedImage} />
			</label>

			<label class="label-img">
				<img class="selectedImg" src="/default4.png" alt="defaultAvatar4" />
				<br>
				<input type="radio" name="image" value="default4.png" bind:group={selectedImage} />
			</label>
		</div>

		<!-- Upload a custom avatar -->
		<p>------------------------------------------------------------------------------</p>
		<p>Or upload a custom avatar (no more than 200K): </p>
		<input type="file" accept="image/*" on:change={handleFileChange}>
		<br>
		{#if avatarPreview}
		<img src={avatarPreview} alt="preview avatar" height="150px">
		<p>Wow, your avatar looks cool!</p>
		{/if}

		<button type="submit">Submit</button>
	</div>
</form>

<!-- this a goToLogin button -->
<div class="goToLogin">
	<p>If I have an account?</p>
	<button on:click={() => goto("/login")}>Go to Log In</button>
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
		height: 100px;
	}

	.avatar-form {
		margin: auto;
		max-width: 500px;
		border: 1px dashed green;
		padding: 10px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1px;
	}

	.avatar-form-span {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 10px;
	}

	.goToLogin {
		margin: auto;
		max-width: 500px;
		border: 1px dashed green;
		padding: 10px;
		display: grid;
		grid-template-columns: 1fr;
	}

	.error {
		color: rgb(240, 2, 2)
	}
</style>
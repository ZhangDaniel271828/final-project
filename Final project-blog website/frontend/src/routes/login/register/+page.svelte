<script>
	import { goto } from '$app/navigation';
	import{USER_REGISTER} from "$lib/js/api-urls.js"

	//fomr variables
	let username = "";
	let password = "";
	let repeatPassword = "";
	let realName = ""
	let birthDate = "";
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

	//handle register
	async function registerUser() {
		console.log({username, password, realName, birthDate, blurb,selectedImage,file });

		let avatarPath = selectedImage || "";

		try{
			//头像上传
			// **Step 1: 确保用户选择了头像**
			if (!selectedImage && !file) {
            alert("请选择一个头像或上传自定义头像！");
            return;
        }

        // **Step 2: 处理头像上传（如果有文件）**
        if (file) {
            const formData = new FormData();
            formData.append("avatar", file);

            const avatarResponse = await fetch("/avatar/upload", {
                method: "POST",
                body: formData
            });

            if (!avatarResponse.ok) {
                alert("头像上传失败，请重试");
                return;
            }

            const avatarData = await avatarResponse.json();
            avatarPath = avatarData.avatar; // 服务器返回的头像 URL
        } else {
            // **Step 3: 如果没有文件但用户选择了预设头像**
            avatarPath = selectedImage;
        }

			//注册：
			const response = await fetch(USER_REGISTER, {
				method: "POST",
				headers: {
				"Content-Type": "application/json"
				},
				body: JSON.stringify({username, password, realName, birthDate, blurb,imageLink: avatarPath})
			});
			
			if (response.status === 201) {
				alert("Success! Please Log in");
				goto("/login");
			}
			if(response.status === 400){
				alert("Missing required fields");
			}

		}catch(error){
      alert("error!");
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


		<label for="realName">Real Name:</label>
		<input type="text" name="realName" bind:value={realName} required />


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
		{:else}
  			<img src={selectedImage} alt="selected avatar" height="150px">
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
	
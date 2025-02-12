<script>
  import { goto } from "$app/navigation";
  import { USER_REGISTER, CHECK_USERNAME, AVATARUPLOAD_URL } from "$lib/js/api-urls.js";
  import {} from "$lib/js/api-urls.js";

  //fomr variables
  let username = "";
  let password = "";
  let repeatPassword = "";
  let realName = "";
  let birthDate = "";
  let blurb = "";

  // avator variables and function
  let selectedImage = null;
  let avatarPreview = "";
  let file = null;
  let fileInput;
  //clear avatar data
  function clearUploadedData() {
    avatarPreview = "";
    file = null;
    if (fileInput) fileInput.value = "";
  }
  //if user select default img, clear the uploaded custom avatar data.
  $: clearUploadedData(selectedImage);

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

  //handle register
  let imageLink = "";
  async function registerUser() {
    //check password and username
    if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (usernameExists) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    try {
      //avatar upload
      if (!selectedImage && !file) {
        alert("please choose an avatar!");
        return;
      }
      console.log(file);
      if (file) {
        const formData = new FormData();
        formData.append("avatar", file);
        const avatarResponse = await fetch(AVATARUPLOAD_URL, {
          method: "POST",
          body: formData
        });
        if (!avatarResponse.ok) {
          alert("upload error!");
          return;
        }
        // get url returned
        const avatarData = await avatarResponse.json();
        imageLink = avatarData.avatar;
      } else {
        imageLink = selectedImage;
      }

      //check information of register
      console.log({ username, password, realName, birthDate, blurb, imageLink });
      const response = await fetch(USER_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, realName, birthDate, blurb, imageLink })
      });

      if (response.status === 201) {
        alert("Success! Please Log in");
        goto("/login");
      }
      if (response.status === 400) {
        alert("Missing required fields");
      }
    } catch (error) {
      alert("Registration failed!");
    }
  }

  //check if username exists
  let usernameExists = false;
  async function checkUsername() {
    if (username) {
      try {
        const response = await fetch(`${CHECK_USERNAME}?username=${username}`);
        if (!response.ok) {
          // check status code
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
</script>

<!-- HTML part -->
<svelte:head>
  <title>Register Page</title>
</svelte:head>

<div class="register-container">
  <div class="register-card">
    <h1>Create Account</h1>
    <!-- form part -->
    <form on:submit|preventDefault={registerUser}>
      <!-- Basic Form Section -->
      <div class="form-section">
        <h2>Basic Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              bind:value={username}
              required
              placeholder="Your unique ID"
            />
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              bind:value={password}
              required
              placeholder="••••••••"
            />
          </div>

          <div class="form-group">
            <label for="repeatPassword">Confirm Password:</label>
            <input
              type="password"
              id="repeatPassword"
              bind:value={repeatPassword}
              required
              placeholder="••••••••"
            />
            {#if password != repeatPassword && repeatPassword != ""}
              <div class="error-message">⚠️ Passwords must match!</div>
            {/if}
          </div>

          <div class="form-group">
            <label for="realName">Full Name:</label>
            <input
              type="text"
              id="realName"
              bind:value={realName}
              required
              placeholder="Your real name"
            />
          </div>

          <div class="form-group">
            <label for="birthDate">Date Of Birth:</label>
            <input type="date" id="birthDate" bind:value={birthDate} required class="date-input" />
          </div>
        </div>
      </div>

      <!-- Profile Section -->
      <div class="form-section">
        <h2>Profile Details</h2>
        <div class="form-group">
          <label for="blurb">Introduction:</label>
          <textarea
            id="blurb"
            bind:value={blurb}
            rows="4"
            required
            placeholder="Tell us something interesting about yourself..."
          ></textarea>
        </div>
      </div>

      <!-- Avatar Section -->
      <div class="form-section">
        <h2>Avatar Selection</h2>
        <div class="avatar-grid">
          {#each ["default1.png", "default2.png", "default3.png", "default4.png"] as image}
            <label class="avatar-option">
              <input type="radio" name="image" value={image} bind:group={selectedImage} />
              <img
                src={`http://localhost:3000/uploads/${image}`}
                alt="avatar"
                class:selected={selectedImage === image}
              />
            </label>
          {/each}
        </div>

        <div class="custom-upload">
          <p class="divider">OR</p>
          <label class="upload-btn">
            📤 Upload Custom Avatar
            <input
              type="file"
              accept="image/*"
              on:change={handleFileChange}
              bind:this={fileInput}
              hidden
            />
          </label>
          {#if avatarPreview}
            <div class="preview-wrapper">
              <img src={avatarPreview} alt="preview" class="avatar-preview" />
              <p class="preview-text">Looking great!</p>
            </div>
          {/if}
        </div>
      </div>

      <button type="submit" class="submit-btn">Create Account</button>
    </form>

    <div class="alternative-actions">
      <span>Already registered?</span>
      <button class="login-btn" on:click={() => goto("/login")}> Sign In Instead </button>
    </div>
  </div>
</div>

<!-- css part -->
<style>
  .register-container {
    background: linear-gradient(135deg, #fff5f7 0%, #f8f4ff 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .register-card {
    color: black;
    background: linear-gradient(135deg, #fff5f7 0%, #f8f4ff 100%);
    padding: 2.5rem;
    border-radius: 1.5rem;
    width: 100%;
    max-width: 800px;
  }

  h1 {
    text-align: center;
    color: #2d3748;
    margin-bottom: 2rem;
    font-size: 2.2rem;
    letter-spacing: -0.5px;
  }

  h2 {
    color: #f99abd;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    border-bottom: 1.5px solid #444;
    padding-bottom: 0.5rem;
  }

  .form-section {
    margin-bottom: 2.5rem;
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.6rem;
    color: #4a5568;
    font-size: 0.95rem;
  }

  input,
  textarea {
    width: 90%;
    padding: 0.9rem;
    background: white;
    border: 1px solid #ffd6e7;
    border-radius: 0.7rem;
    color: #2d3748;
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: #ff85b2;
    box-shadow: 0 0 0 4px rgba(255, 133, 178, 0.15);
  }

  .date-input::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .avatar-option img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 0.8rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .avatar-option img.selected {
    border-color: #ff85b2;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 133, 178, 0.3);
  }

  .custom-upload {
    text-align: center;
    margin-top: 2rem;
  }

  .divider {
    color: #2d3748;
    margin: 1.5rem 0;
    position: relative;
  }

  .divider:before,
  .divider:after {
    content: "";
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #444;
  }

  .divider:before {
    left: 0;
  }
  .divider:after {
    right: 0;
  }

  .upload-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.9rem 1.8rem;
    background: #ff85b2;
    color: white;
    border-radius: 0.7rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .upload-btn:hover {
    background: #ff6b9d;
    transform: translateY(-2px);
  }

  .avatar-preview {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    margin: 1.5rem auto;
    border: 3px solid #ff85b2;
  }

  .submit-btn {
    width: 100%;
    padding: 1.2rem;
    background: #ff85b2;
    color: white;
    border: none;
    border-radius: 0.8rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:hover {
    background: #ff6b9d;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 133, 178, 0.3);
  }

  .error-message {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 0.5rem;
  }

  .alternative-actions {
    text-align: center;
    margin-top: 2rem;
    color: #718096;
  }

  .login-btn {
    display: block;
    width: 100%;
    padding: 0.8rem;
    margin-top: 1rem;
    background: white;
    border: 1px solid #ffd6e7;
    color: #ff85b2;
    border-radius: 0.7rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-btn:hover {
    border-color: #ff85b2;
    background: rgba(255, 133, 178, 0.1);
  }
</style>

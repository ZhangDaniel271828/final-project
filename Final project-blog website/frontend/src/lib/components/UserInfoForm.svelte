<script>
  import { invalidate } from "$app/navigation";
  import { USER_UPDATE, USER_DELETE } from "$lib/js/api-urls.js";
  import { goto } from "$app/navigation";
  export let user;
  import { invalidateAll } from "$app/navigation";

  //User's basic info
  let username = user.username;
  let realName = user.realName;
  let birthDate = user.birthDate;
  let blurb = user.blurb;
  let imageLink = user.imageLink;

  //handle update User's info
  let error = false;
  let success = false;
  async function handleSave() {
    error = false;
    success = false;

    const response = await fetch(USER_UPDATE, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, realName, birthDate, blurb })
    });

    success = response.status === 204;
    error = !success;

    if (success) invalidate(USER_UPDATE);
  }

  //delelte current account and logout
  async function deleteAccount() {
    const response = await fetch(USER_DELETE, {
      method: "DELETE",
      credentials: "include"
    });

    if (response.status == 204) {
      alert("Your account has been deleted");
      await invalidateAll();
    } else {
      alert("error");
    }
  }

  console.log(imageLink);
</script>

<form on:submit|preventDefault={handleSave}>
  <div class="basicInfo1">
    <div class="avatar-wrapper">
      <img
        class="avatar"
        src={`http://localhost:3000/uploads/${imageLink}`}
        height="200px"
        alt="Image12"
      />
    </div>
    <label for="username">Username:</label>
    <input type="text" name="username" bind:value={username} required />
    <label for="lastName">Real Name:</label>
    <input type="text" name="lastName" bind:value={realName} required />
    <label for="dob">Date of Birth:</label>
    <input type="text" name="dob" bind:value={birthDate} required />
  </div>

  <div class="basicInfo2">
    <!-- displaying blurb -->
    <textarea bind:value={blurb} rows="12" required />

    <button type="submit">Save</button>
    <!-- display saving result -->
    {#if error}
      <span class="error">Could not save!</span>{/if}
    {#if success}<span class="success">Saved!</span>{/if}
    <br>
    <br>
    <div class="deleteButton"><button on:click={deleteAccount}>Delete Account</button></div>

  </div>

  <br />
  <br />
  <br />
  <br />
</form>

<!-- delte button -->

<style>
  form {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .basic-info,
  .blurb-section {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
  }

  input[type="text"],
  input[type="date"],
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    box-sizing: border-box;
  }

  .avatar-wrapper {
    display: flex;
    justify-content: center; 
    align-items: center; 
    width: 100%;
    margin-bottom: 20px;
  }

  .avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    object-fit: cover;
  }

  .form-actions {
    text-align: center;
  }

  .save-button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }

  .save-button:hover {
    background-color: #45a049;
  }

  .delete-account {
    max-width: 600px;
    margin: 20px auto;
    text-align: center;
  }

  .delete-button {
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }

  .delete-button:hover {
    background-color: #e53935;
  }

  .error,
  .success {
    display: block;
    margin-top: 10px;
    font-weight: bold;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
  }

  .error {
    color: #d8000c;
    background-color: #ffbaba;
  }

  .success {
    color: #4f8a10;
    background-color: #dff2bf;
  }
</style>

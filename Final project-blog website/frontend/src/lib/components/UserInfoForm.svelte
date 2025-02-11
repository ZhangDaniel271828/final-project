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

    if(response.status == 204){
      alert("Your account has been deleted")
      await invalidateAll();
    }else{
      alert("error");
    }
  }



</script>



<form on:submit|preventDefault={handleSave}>

  <div class = "baiscInfo1"> 
    <label for="username">Username:</label>
    <input type="text" name="username" bind:value={username} required />
    <label for="lastName">Real Name:</label>
    <input type="text" name="lastName" bind:value={realName} required />
    <label for="dob">Date of Birth:</label>
    <input type="text" name="dob" bind:value={birthDate} required />
  </div>

  <div class = "basicInfo2">
    <!-- displaying blurb -->
    <textarea bind:value={blurb} rows="12" required />


    <button type="submit">Save</button>
      <!-- display saving result -->
    {#if error} <span class="error">Could not save!</span>{/if}
    {#if success}<span class="success">Saved!</span>{/if}
  </div>

  <br>
  <br>
  <br>
  <br>

</form>

<!-- delte button -->
<div class = "deleteButton"><button on:click = {deleteAccount} >Delete Account</button></div>




<style>
  .baiscInfo1 {
    margin: auto;
    max-width: 800px;
    border: 1px dashed green;
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  }
  .basicInfo2 {
    margin: auto;
    max-width: 800px;
    border: 1px dashed green;
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .deleteButton{
    margin: auto;
    max-width: 800px;
    border: 1px dashed green;
    background-color: rgb(238, 165, 165);
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
  }






 



  .error,
  .success {
    font-weight: bold;
    padding: 5px;
    text-align: center;
  }

  .error {
    color: darkred;
    background-color: lightcoral;
  }

  .success {
    color: darkgreen;
    background-color: lightgreen;
  }
</style>

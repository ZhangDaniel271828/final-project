<script>
  import { goto } from "$app/navigation";
  import { AUTH_LOGIN } from "$lib/js/api-urls.js";
  import { invalidateAll } from "$app/navigation";

  // basic user info
  let username = "";
  let password = "";
  let error = false;

  //submit and login
  async function handleSubmit() {
    error = false;
    const response = await fetch(AUTH_LOGIN, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
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

<!-- html part -->
<div class="login-container">
  <div class="login-card">
    <h1>Welcome Back</h1>

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="Enter your username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          required
        />
      </div>

      {#if error}
        <div class="error-message">
          ⚠️ Could not log in with those credentials, please try again.
        </div>
      {/if}

      <button type="submit" class="login-btn">Sign In</button>
    </form>

    <div class="alternative-actions">
      <span>New here?</span>
      <button class="register-btn" on:click={() => goto("login/register")}> Create Account </button>
    </div>
  </div>
</div>

<!-- css part -->
<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff5f7 0%, #f8f4ff 100%);
    padding: 2rem;
  }

  .login-card {
    background: white;
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s ease;
  }

  h1 {
    text-align: center;
    color: #2d3748;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-size: 0.9rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ffd6e7;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  input:focus {
    outline: none;
    border-color: #ff85b2;
    box-shadow: 0 0 0 3px rgba(255, 133, 178, 0.2);
  }

  .login-btn {
    width: 100%;
    padding: 1rem;
    background: #ff6b9d;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-btn:hover {
    background: #ff5290;
    transform: translateY(-1px);
  }

  .alternative-actions {
    margin-top: 1.5rem;
    text-align: center;
    color: #718096;
  }

  .register-btn {
    display: block;
    width: 100%;
    padding: 0.8rem;
    margin-top: 1rem;
    background: none;
    border: 1px solid #ffd6e7;
    color: #ff6b9d;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .register-btn:hover {
    background: #fff5f7;
    border-color: #ff85b2;
  }

  .error-message {
    padding: 0.8rem;
    margin: 1rem 0;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #fca5a5;
  }
</style>

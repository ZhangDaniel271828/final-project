<script>
  export let user;
  let article_title = "";
  let content = "";  
  let username = user.username;
  let authorId = user.id;

  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import TextEditor from './TextEditor.svelte';

  // Post an article
  let success = false;

  async function handlePost() {
    let error = false;
    let success = false;

    console.log("Submitting article:", { authorId, username, article_title, content });

    const response = await fetch(ARTICLES_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId, username, title: article_title, content }) // 修改: 确保字段名正确
    });

    success = response.status === 201;
    error = !success;

    if (success) {
      alert("Article posted successfully!");
    } else {
      const errorMessage = await response.text(); 
      console.error("Error response:", errorMessage);
      alert('Failed to post article: ' + errorMessage);
    }
  }

  function handleContentChange(event) {
    content = event.detail.content;
  }
</script>

<div class="postMain">
  <h1>Post an article</h1>
  <div class="basicInfo1">
    <form on:submit|preventDefault={handlePost}>
      <label for="article_title">Title:</label>
      <input type="text" id="article_title" bind:value={article_title} required />
      <br>
      <TextEditor {content} on:contentChange={handleContentChange} />
      <br>
      <button type="submit">Post</button>
    </form>
  </div>
</div>

<style>
  .postMain {
    margin-left: 480px;
    margin-top: -200px;
  }
  h1 {
    margin-left: 280px;
  }
  form {
    margin: auto;
    max-width: 800px;
    border: 1px dashed green;
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
  }
</style>
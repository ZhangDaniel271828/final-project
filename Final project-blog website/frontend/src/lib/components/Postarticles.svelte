<script>
  export let user;
  let article_title = "";
  let content = "";
  let username = user.username;
  let authorId = user.id;

  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import Editor from "@tinymce/tinymce-svelte";

  let conf = {
    height: 500,
    menubar: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "preview",
      "help",
      "wordcount"
    ],
    toolbar:
      "undo redo | blocks | " +
      "bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "removeformat | image media help",
    image_advtab: true,
    paste_data_images: true, 
    images_upload_handler: function (blobInfo) {
      return new Promise((resolve, reject) => {
        
        const reader = new FileReader();
        reader.onloadend = function () {
        
          const base64String = reader.result.split(",")[1]; 

          resolve("data:image/jpeg;base64," + base64String); 
        };

        reader.onerror = function () {
          reject(new Error("Image upload failed: Unable to read file."));
        }; 
        reader.readAsDataURL(blobInfo.blob());
      });
    }
  };

  async function handlePost() {
    console.log("Submitting article:", { authorId, username, article_title, content });

    const response = await fetch(ARTICLES_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId, username, article_title, content })
    });

    if (response.status === 201) {
      alert("Article posted successfully!");
      location.reload();
    } else {
      const errorMessage = await response.text();
      console.error("Error response:", errorMessage);
      alert("Failed to post article.");
    }
  }
</script>

<form class="post-container" on:submit|preventDefault={handlePost}>
  <h1>Post an Article</h1>

  <label for="title">Title:</label>
  <input type="text" id="title" bind:value={article_title} required />

  <label for="content">Content:</label>
  <Editor apiKey="dw3gchjnq8vlhofa34s8mo2hrxlrsv80qnarmafb1r9j2z7z" {conf} bind:value={content} />

  <div class="button-group">
    <button type="submit" class="primary">Post</button>
    <button type="button" class="secondary" on:click={() => location.reload()}>Cancel</button>
  </div>
</form>

<!-- css part   -->

<style>
  .post-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2.5rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px rgba(45, 55, 72, 0.1);
    border: 2px solid rgba(255, 214, 231, 0.3);
    position: relative;
    overflow: hidden;
  }

  .post-container::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 214, 231, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 8s infinite;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }

  h1 {
    text-align: center;
    color: #2d3748;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #2d3748 0%, #ffd6e7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(255, 214, 231, 0.2);
  }

  label {
    color: #2d3748;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
    display: block;
    font-size: 1.1rem;
  }

  input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #ffd6e7;
    border-radius: 1rem;
    font-size: 1.1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.9);
  }

  input:focus {
    border-color: #2d3748;
    box-shadow: 0 0 0 4px rgba(255, 214, 231, 0.3);
    outline: none;
  }

  .tox-tinymce {
    border: 2px solid #ffd6e7 !important;
    border-radius: 1rem !important;
    margin: 1rem 0;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .tox-tinymce:hover {
    box-shadow: 0 4px 15px rgba(255, 214, 231, 0.3);
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .primary {
    background: linear-gradient(135deg, #ffd6e7 0%, #2d3748 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(45, 55, 72, 0.2);
  }

  .primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45, 55, 72, 0.3);
  }

  .secondary {
    background: transparent;
    border: 2px solid #ffd6e7;
    color: #2d3748;
  }

  .secondary:hover {
    background: rgba(255, 214, 231, 0.1);
    transform: translateY(-2px);
  }
  .tox-toolbar__primary {
    background: rgba(255, 214, 231, 0.1) !important;
    border-bottom: 1px solid #ffd6e7 !important;
  }

  .tox-tbtn:hover {
    background: rgba(45, 55, 72, 0.1) !important;
  }

  .tox-tbtn svg {
    fill: #2d3748 !important;
  }

  body {
    background: linear-gradient(135deg, #f8f4ff 0%, #fff5f7 100%);
    min-height: 100vh;
    padding: 2rem;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>

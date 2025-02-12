<script>
  import { invalidate } from "$app/navigation";
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  export let articleId;
  import { onMount } from "svelte";
  import Editor from "@tinymce/tinymce-svelte";

  let article_title = "";
  let content = "";
  let error = false;
  let success = false;

  // editor configure
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
    // Allow pasting of Base64 images
    paste_data_images: true,
    images_upload_handler: function (blobInfo) {
      return new Promise((resolve, reject) => {
        // Use FileReader to convert the image to base64 format
        const reader = new FileReader();

        reader.onloadend = function () {
          // Get the base64 string
          const base64String = reader.result.split(",")[1]; // Remove the prefix

          // return string
          resolve("data:image/jpeg;base64," + base64String); // Adjust the mime type according to image format (image/jpeg)
        };

        reader.onerror = function () {
          reject(new Error("Image upload failed: Unable to read file."));
        };
        // Read the image in base64 format
        reader.readAsDataURL(blobInfo.blob());
      });
    }
  };
  //handle edit the articles
  async function handleEditArticle() {
    error = false;
    success = false;
    // Parse HTML content, find Base64 image and upload it
    let doc = new DOMParser().parseFromString(content, "text/html");
    let images = doc.querySelectorAll("img");

    for (let img of images) {
      let src = img.getAttribute("src");

      if (src.startsWith("data:image")) {
        let formData = new FormData();
        formData.append("image", await fetch(src).then((res) => res.blob()));

        try {
          let response = await fetch(`${ARTICLES_URL}/upload-image`, {
            method: "POST",
            body: formData
          });

          if (!response.ok) throw new Error("Image upload failed");

          let data = await response.json();
          let imageUrl = `http://localhost:3000${data.imageUrl}`;
          img.setAttribute("src", imageUrl);
        } catch (error) {
          console.error("error:", error);
          alert("error");
          return;
        }
      }
    }

    // Get the new article content (Base64 image has been replaced with URL)    content = doc.body.innerHTML;

    // Send update request
    const response = await fetch(`${ARTICLES_URL}/update/${articleId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_title, content })
    });

    success = response.status === 204;
    error = !success;

    if (success) {
      alert("success!");
      invalidate(ARTICLES_URL);

      // Automatically refresh the page after 1 second
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      alert(" failed");
    }
  }
  // get the article by id
  async function fetchArticle(id) {
    if (!id) return;

    try {
      const response = await fetch(`${ARTICLES_URL}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      const data = await response.json();
      article_title = data.article_title;
      content = data.content;
    } catch (err) {
      console.error("Error fetching article:", err);
    }
  }
  onMount(() => {
    fetchArticle(articleId);
  });
</script>

<!-- edit part -->
<form on:submit|preventDefault={handleEditArticle}>
  <div class="edit-container">
    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={article_title} required />

    <label for="content">Content:</label>

    <!-- Use TinyMCE to bind content -->
    <Editor
      apiKey="dw3gchjnq8vlhofa34s8mo2hrxlrsv80qnarmafb1r9j2z7z"
      channel="7"
      bind:value={content}
      {conf}
    />

    <button type="submit">Save</button>
    <button type="button" on:click={() => location.reload()}>Cancel</button>

    {#if error}
      <span class="error">Failed to update!</span>
    {/if}
    {#if success}
      <span class="success">Updated successfully! Refreshing...</span>
    {/if}
  </div>
</form>

<!-- css part -->
<style>
  .edit-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2.5rem;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 2rem;
    box-shadow: 0 12px 40px rgba(255, 214, 231, 0.3);
    border: 3px solid #ffd6e7;
    position: relative;
    overflow: hidden;
    font-family: "Comic Neue", cursive;
  }

  .edit-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 214, 231, 0.1),
      rgba(255, 214, 231, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
    );
    z-index: -1;
  }

  label {
    color: #2d3748;
    font-size: 1.2rem;
    margin: 1.5rem 0 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  label::before {
    content: "🌸";
    font-size: 1.5rem;
  }

  input {
    width: 100%;
    padding: 1.2rem;
    border: 3px solid #ffd6e7;
    border-radius: 1.5rem;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
  }

  input:focus {
    border-color: #2d3748;
    box-shadow: 0 0 0 4px rgba(255, 214, 231, 0.4);
    outline: none;
    transform: scale(1.02);
  }

  .tox-tinymce {
    border: 3px solid #ffd6e7 !important;
    border-radius: 1.5rem !important;
    margin: 1.5rem 0;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .tox-tinymce:hover {
    box-shadow: 0 8px 20px rgba(255, 214, 231, 0.3);
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }

  button {
    width: 45%;
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: 2rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    margin: 1rem 0.5rem;
  }

  button[type="submit"] {
    background: linear-gradient(135deg, #ffd6e7 0%, #2d3748 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(255, 214, 231, 0.4);
  }

  button[type="submit"]::after {
    content: "✏️";
    position: absolute;
    right: 1.5rem;
    opacity: 0;
    transition: all 0.3s ease;
  }

  button[type="submit"]:hover {
    background: #2d3748;
    color: #ffd6e7;
  }

  button[type="submit"]:hover::after {
    opacity: 1;
    right: 1rem;
  }

  button[type="button"] {
    background: linear-gradient(135deg, #ffd6e7 0%, #2d3748 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(255, 214, 231, 0.4);
  }

  button[type="button"]:hover {
    background: #2d3748;
    color: #ffd6e7;
  }

  .error,
  .success {
    padding: 1rem;
    border-radius: 1rem;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.1rem;
  }

  .error {
    background: #ffe9ec;
    color: #ff4d6d;
    border: 2px solid #ff4d6d;
  }

  .error::before {
    content: "❌";
    font-size: 1.5rem;
  }

  .success {
    background: #e8f9f1;
    color: #2d3748;
    border: 2px solid #2d3748;
  }

  .success::before {
    content: "🎉";
    font-size: 1.5rem;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @import url("https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap");

  body {
    background: linear-gradient(150deg, #fff5f7 0%, #f8f4ff 100%);
    min-height: 100vh;
    padding: 2rem;
  }

  .tox-toolbar__primary {
    background: rgba(255, 214, 231, 0.1) !important;
    border-radius: 1rem 1rem 0 0 !important;
  }

  .tox-tbtn:hover {
    background: rgba(45, 55, 72, 0.1) !important;
    border-radius: 0.5rem !important;
  }
</style>

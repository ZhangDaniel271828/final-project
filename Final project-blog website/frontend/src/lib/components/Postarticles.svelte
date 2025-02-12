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
    paste_data_images: true, // 允许粘贴 Base64 图片
    images_upload_handler: function (blobInfo) {
      return new Promise((resolve, reject) => {
        // 使用 FileReader 将图片转换为 base64 格式
        const reader = new FileReader();
        reader.onloadend = function () {
          // 获取 base64 字符串
          const base64String = reader.result.split(",")[1]; // 去掉前缀部分
          // 返回 base64 字符串

          resolve("data:image/jpeg;base64," + base64String); // 根据你的图片格式调整 mime 类型（image/jpeg）
        };

        reader.onerror = function () {
          reject(new Error("Image upload failed: Unable to read file."));
        }; // 读取图片为 base64 格式

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

<style>
  .post-container {
    max-width: 800px;
    margin: auto;
    padding: 15px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 8px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    color: #333;
  }

  label {
    font-weight: bold;
    margin-top: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .primary {
    background: #28a745;
    color: white;
  }

  .primary:hover {
    background: #218838;
  }

  .secondary {
    background: #ccc;
  }

  .secondary:hover {
    background: #aaa;
  }
</style>

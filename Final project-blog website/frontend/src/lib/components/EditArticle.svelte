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

  let conf = {
    height: 500,
    menubar: false,
    plugins: [
      "advlist", "autolink", "lists", "link", "image", "charmap",
      "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
      "insertdatetime", "media", "table", "preview", "help", "wordcount"
    ],
    toolbar: "undo redo | blocks | " +
      "bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "removeformat | image media help",
    
    image_advtab: true,
    paste_data_images: true, // 允许粘贴 Base64 图片
    images_upload_handler: (blobInfo, success, failure) => {
      // 处理 Base64 图片上传
      let formData = new FormData();
      formData.append("image", blobInfo.blob());

      fetch(`${ARTICLES_URL}/upload-image`, {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          let imageUrl = `http://localhost:3000${data.imageUrl}`;
          success(imageUrl); // 返回 URL 替换 Base64
        })
        .catch(() => failure("Image upload failed"));
    }
  };
  
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

  async function handleEditArticle() {
    error = false;
    success = false;

    // 解析 HTML 内容，找到 Base64 图片并上传
    let doc = new DOMParser().parseFromString(content, "text/html");
    let images = doc.querySelectorAll("img");

    for (let img of images) {
      let src = img.getAttribute("src");

      if (src.startsWith("data:image")) {
        let formData = new FormData();
        formData.append("image", await fetch(src).then(res => res.blob()));

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
  
      // 获取新的文章内容（Base64 图片已替换为 URL）
      content = doc.body.innerHTML;
  
      // 发送更新请求
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
  
        // 1 秒后自动刷新页面
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        alert(" failed");
      }
    }
  </script>
  
<form on:submit|preventDefault={handleEditArticle}>
  <div class="edit-container">
    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={article_title} required />

    <label for="content">Content:</label>
    
    <!--  使用 TinyMCE 绑定 content -->
    <Editor
      apiKey="dw3gchjnq8vlhofa34s8mo2hrxlrsv80qnarmafb1r9j2z7z"
      channel="7"
      bind:value={content}  
      {conf}
    />

    <button type="submit">Save</button>
    <button type="button" on:click={() => location.reload()}>Cancel</button> 

    {#if error} <span class="error">Failed to update!</span> {/if}
    {#if success} <span class="success">Updated successfully! Refreshing...</span> {/if}
  </div>
</form>
  
<style>
  .edit-container {
    max-width: 800px;
    margin: auto;
    padding: 15px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .error {
    color: red;
    font-weight: bold;
  }

  .success {
    color: green;
    font-weight: bold;
  }
</style>
  
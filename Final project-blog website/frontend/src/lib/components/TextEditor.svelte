<script>
    import { onMount } from 'svelte';
    import Editor from '@tinymce/tinymce-svelte';
  
    export let content = ''; // Bind the content of the editor
    export let onUpdate; // Accept the update content
    let editorContent = content;
  
    // Configure TinyMCE
    const tinymceConfig = {
      height: 300,
      menubar: false,
      // Add plugins
      plugins: 'lists underline image imagetools',
      // Add toolbar buttons
      toolbar: 'undo redo | bold italic underline image | bullist numlist',
      // Add image upload configuration
      images_upload_url: '/api/upload-image',
      images_upload_credentials: true, // Take cookies into account
      images_upload_handler: (blobInfo, success, failure) => {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
            credentials: 'include' // 发送 Cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.location) {
                success(data.location); // TinyMCE 插入图片
            } else {
                failure('图片上传失败');
            }
        })
        .catch(() => failure('上传出错'));
    },
      content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
      setup: (editor) => {
        editor.on('input change', () => {
          editorContent = editor.getContent();
          onUpdate(editorContent); // // Pass the updated content to the parent component
        });
      },
    };
</script>

<div class="editor-container">
  <Editor
    apiKey="3prs0twvc8qww7n4rtk58bgjs2cd5vt1iwo64hze23xy42fp"
    {tinymceConfig}
    bind:value={editorContent}
  />
</div>
  
<style>
    .editor-container {
      margin: 1rem 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
</style>
  

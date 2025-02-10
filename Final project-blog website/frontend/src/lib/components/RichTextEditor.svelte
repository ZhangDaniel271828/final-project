<script>
    import { onMount } from 'svelte';
    import Editor from '@tinymce/tinymce-svelte';
  
    export let content = ''; // 用于绑定编辑器内容
    export let onUpdate; // 用于接收内容更新回调
  
    // TinyMCE 配置
    const tinymceConfig = {
      height: 300,
      menubar: false,
      plugins: 'lists underline',
      toolbar: 'undo redo | bold italic underline | bullist numlist',
      content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
      setup: (editor) => {
        editor.on('input change', () => {
          const updatedContent = editor.getContent();
          onUpdate(updatedContent); // 将更新后的内容传递给父组件
        });
      },
    };
</script>

<div class="editor-container">
  <Editor
    apiKey="3prs0twvc8qww7n4rtk58bgjs2cd5vt1iwo64hze23xy42fp"
    {tinymceConfig}
    bind:value={content}
  />
</div>
  
<style>
    .editor-container {
      margin: 1rem 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
</style>
  

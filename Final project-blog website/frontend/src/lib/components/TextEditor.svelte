<script lang="ts">
  import Editor from '@tinymce/tinymce-svelte';
  import { createEventDispatcher } from 'svelte';

  // Define the content prop with TypeScript type
  export let content= "";

  // Create an event dispatcher
  const dispatch = createEventDispatcher();

  let apiKey = "3prs0twvc8qww7n4rtk58bgjs2cd5vt1iwo64hze23xy42fp";
  let conf = {
    height: 500,
    plugins: [
      "a11ychecker", "advlist", "advcode", "advtable", "autolink", "checklist", "export",
      "lists", "link", "image", "charmap", "preview", "anchor", "searchreplace", "visualblocks",
      "powerpaste", "fullscreen", "formatpainter", "insertdatetime", "media", "table", "help", "wordcount"
    ],
    toolbar: "undo redo | a11ycheck casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | " +
      "bullist numlist checklist outdent indent | removeformat | code table help"
  };

  function handleEditorChange(event: CustomEvent<{ value: string }>) {
    content = event.detail.value;
    dispatch('contentChange', { content });
  }
</script>

<main>
  <Editor
    {apiKey}
    {conf}
    bind:value={content}
    on:input={handleEditorChange}
  />
</main>
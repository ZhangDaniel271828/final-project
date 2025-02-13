<script>
  import { COMMENTS_URL } from "$lib/js/api-urls.js";
  import { onMount } from "svelte";

  //get user's Info
  export let user;
  export let articleId;
  let userId = user.id;
  let parentId = null;
  //User's basic info

  //Handle comments info
  let comments = [];
  //get comments based on articleId
  async function getComments() {
    try {
      const response = await fetch(`${COMMENTS_URL}/${articleId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      comments = await response.json();
    } catch (error) {
      console.error("Error fetching comments:", error);
      comments = [];
    }
  }
  onMount(getComments);
  $: user, getComments();

  //reply function
  let replies = {};
  function showReplyForm(commentId) {
    // Toggle the reply form for the specific comment
    if (replies[commentId] == 1) {
      replies[commentId] = 0;
    } else {
      replies[commentId] = 1;
    }
  }

  //submit function
  let replyContent = "";
  async function submitReply(parentId) {
    if (replyContent == "") return alert("please writte some content!");
    let content = replyContent;
    console.log(articleId, content, userId, parentId);
    let commentData = { articleId, parentId, userId, content };

    try {
      const response = await fetch(COMMENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      if (response.status === 201) {
        replyContent = "";
        replies[parentId] = 0;
        getComments();
        parentId = null;
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply!");
    }
  }

  //delete function
  async function deleteComment(Id) {
    try {
      const response = await fetch(`${COMMENTS_URL}/${Id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        alert("Comment deleted successfully");
        await getComments();
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment!");
    }
  }

  let displayComment = true;
  function toggle() {
    displayComment = !displayComment;
  }
</script>

<div class="comments">
  <h2>Comments</h2>

  <!-- //set up top reply -->
  <div class="reply-form">
    <textarea rows="6" cols="85" bind:value={replyContent}></textarea>
    <br />
    <button on:click={() => submitReply(parentId)}>submit</button>
    <br />
    <br />
    <button on:click={toggle}>show/hide comments</button>
    <br />
  </div>

  {#if displayComment}
    {#each comments as comment}
      <!-- set up main comment -->
      <div class="mainComments">
        <span class="username"><strong>{comment.username}:</strong>&nbsp;</span>
        <span class="contentLevel1">{comment.content}</span>
        <br />
        <span class="timeStamp">{comment.createdAt}</span>

        <!-- //set up reply level1 button -->
        <button on:click={() => showReplyForm(comment.id)}>reply</button>
        {#if replies[comment.id] == 1}
          <div class="reply-form">
            <textarea rows="6" cols="80" bind:value={replyContent}></textarea>
            <br />
            <button on:click={() => submitReply(comment.id)}>submit</button>
          </div>
        {/if}

        <!-- //set up delete level1 button -->
        {#if user.id == comment.userId}
          <button on:click={() => deleteComment(comment.id)}>Delete</button>
        {/if}

        <!-- set up second comment -->
        {#if comment.childComment && comment.childComment.length > 0}
          {#each comment.childComment as child}
            <div class="childComment1">
              <span class="username"><strong>{child.username}:</strong>&nbsp;</span>
              <span class="contentLevel2">{child.content}</span>
              <span class="timeStamp">{child.createdAt}</span>

              <!-- //set up reply level2 button -->
              <button on:click={() => showReplyForm(child.id)}>reply</button>
              {#if replies[child.id] == 1}
                <div class="reply-form">
                  <textarea rows="6" cols="70" bind:value={replyContent}></textarea>
                  <br />
                  <button on:click={() => submitReply(child.id)}>submit</button>
                </div>
              {/if}

              <!-- //set up delete level2 button -->
              {#if user.id == child.userId}
                <button on:click={() => deleteComment(child.id)}>Delete</button>
              {/if}

              <!-- set up third comment -->
              {#if child.childComment && child.childComment.length > 0}
                {#each child.childComment as grandChild}
                  <div class="childComment2">
                    <span class="username"><strong>{grandChild.username}:</strong>&nbsp;</span>
                    <span class="contentLevel3">{grandChild.content}</span>
                    <br />
                    <span class="timeStamp">{grandChild.createdAt}</span>

                    <!-- //set up delete level3 button -->
                    {#if user.id == grandChild.userId}
                      <button on:click={() => deleteComment(grandChild.id)}>Delete</button>
                    {/if}
                  </div>
                {/each}
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    {/each}
  {/if}
</div>

<!-- CSS part -->
<style>
  :root {
    --cdaprimary-color: #f7eaec; /* Light pink */
    --cdasecondary-color: #7b7b7b; /* Dark gray */
    --cdatext-color: #01041b; /* Near white */
  }

  /* Comment section overall container */
  .comments {
    background-color: var(--clnsecondary-color);
    padding-top: 5px;
    padding-bottom: 20px;
    color: var(--clntext-color);
  }

  /* Title */
  h2 {
    margin-left: 50px;
    color: var(--clnprimary-color);
  }

  /* Reply form margin */
  .reply-form {
    margin-left: 40px;
  }

  /* Main comment style */
  .mainComments {
    max-width: 600px;
    border: 1px dashed var(--clnprimary-color);
    background-color: #3a3c58; /* Slightly lighter than dark gray, maintaining hierarchy */
    padding: 10px;
    margin-top: 20px;
    margin-left: 40px;
    color: var(--clntext-color);
  }

  /* Timestamp style */
  .timeStamp {
    font-size: small;
    color: var(--clntext-color);
  }

  /* First level reply (child comment) */
  .childComment1 {
    border: 1px dashed var(--clnprimary-color);
    background-color: #424a66; /* Slightly lighter than main comment */
    padding-left: 30px;
    margin: 10px;
    color: var(--clntext-color);
  }

  /* Second level reply (grandchild comment) */
  .childComment2 {
    border: 1px dashed var(--clnprimary-color);
    background-color: #4a526e; /* Increase brightness again, ensuring clear hierarchy */
    padding-left: 50px;
    margin: 10px;
    color: var(--clntext-color);
  }
</style>

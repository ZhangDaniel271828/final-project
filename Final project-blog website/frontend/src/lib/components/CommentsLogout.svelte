<script>
  import { invalidate } from "$app/navigation";
  import {COMMENTS_URL} from "$lib/js/api-urls.js";
  import { onMount } from "svelte";

  //get user's Info
  export let articleId;
  let parentId = null;


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
          console.error('Error fetching comments:', error);
          comments = [];
      }
  }
  onMount(getComments);
  $: articleId, getComments();

  //reply function
  let replies = {}
  function showReplyForm(commentId) {
    // Toggle the reply form for the specific comment
    if (replies[commentId] == 1) {
        replies[commentId] = 0;
    } else {
        replies[commentId] = 1;
    }
  }
 
  let displayComment = true;
  function toggle(){
    displayComment = !displayComment;
  }


</script>

<div class = "comments">
  <h2>Comments</h2>

  {#if displayComment} 
    {#each comments as comment}
      <!-- set up main comment -->
      <div class="mainComments">
        <span class="username"><strong>{comment.username}:</strong>&nbsp;</span>
        <span class = "contentLevel1">{comment.content}</span>   
        <br>
        <span class = "timeStamp">{comment.createdAt}</span>

        <!-- set up second comment -->
        {#if comment.childComment && comment.childComment.length > 0}
          {#each comment.childComment as child}
            <div class="childComment1">
              <span class="username"><strong>{child.username}:</strong>&nbsp;</span>
              <span class = "contentLevel2">{child.content}</span>
              <span class = "timeStamp">{child.createdAt}</span>
            <!-- set up third comment -->
              {#if child.childComment && child.childComment.length > 0}
                {#each child.childComment as grandChild}
                <div class="childComment2">
                  <span class="username"><strong>{grandChild.username}:</strong>&nbsp;</span>
                  <span class = "contentLevel3">{grandChild.content}</span>
                    <br>
                  <span class = "timeStamp">{grandChild.createdAt}</span>
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
.comments{
  background-color: rgb(229, 221, 239);
  padding-top:5px;
  padding-bottom:20px;
}
h2{
  margin-left:50px;
}
.reply-form{
  margin-left:40px;
}

.mainComments{
  max-width: 600px;
  border: 1px dashed rgb(6, 35, 140);
  background-color: rgb(229, 248, 216);
  padding: 10px; 
  margin-top:20px;
  margin-left:40px;
  
}
.timeStamp{
  font-size:small;
}
.childComment1{
  
  border: 1px dashed rgb(6, 35, 140);
  padding-left: 30px;
  margin: 10px;
}
.childComment2{
  border: 1px dashed rgb(6, 35, 140);
  padding-left: 50px;
  margin: 10px;
}
</style>






 


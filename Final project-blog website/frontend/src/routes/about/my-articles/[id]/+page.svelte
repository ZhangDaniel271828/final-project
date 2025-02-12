<script>
  export let data;
  import CommentsDeleteAll from "$lib/components/CommentsDeleteAll.svelte";
  import EditArticle from "$lib/components/EditArticle.svelte";

  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import { goto } from "$app/navigation";
  import { LIKES_URL } from "$lib/js/api-urls.js";

  //baisc varies
  $: article = data?.article;
  $: id = article?.id;
  $: author = article?.username;

  $: user = data?.user;
  $: isLoggedIn = data?.isLoggedIn;
  $: user_Id = user?.id;
  $: name = user?.username;

  let edit = false;

  // delete an article
  async function deleteArticle() {
    try {
      const response = await fetch(`${ARTICLES_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        alert("Article deleted successfully");
        await invalidateAll();
        goto("/about/my-articles");
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article!");
    }
  }

  //like part
  let likeCount = 0;
  let isLiked = false;
  let buttonClick = 1;

  // display likes
  async function getLikes(id) {
    if (!id) return;
    try {
      const response = await fetch(`${LIKES_URL}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error("can't get articles");
      }
      const data = await response.json();
      likeCount = data.count;
      console.log("likeCount:", likeCount);
    } catch (error) {
      console.error("error", error);
    }
  }
  //check isLiked
  async function checkIsLiked(user_Id, id) {
    const article_Id = id;
    try {
      console.log("user_Id:", user_Id, "article_Id:", article_Id);

      const response = await fetch(`${LIKES_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_Id, article_Id })
      });

      if (!response.ok) {
        throw new Error("Failed to check like status");
      }

      const data = await response.json();
      console.log("Response data:", data);
      isLiked = data.isLiked;
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  }

  // add a like
  async function addLike(user_Id, id) {
    const article_Id = id;
    console.log("user_Id:", user_Id, "article_Id:", article_Id);
    try {
      const response = await fetch(LIKES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_Id, article_Id }) 
      });
      if (!response.ok) {
        throw new Error("Failed to add like");
      }
      console.log("Like added");
      // change the value of buttonClick
      buttonClick = buttonClick === 1 ? 0 : 1;
    } catch (error) {
      console.error("Error adding like:", error);
    }
  }
  //delete a like
  async function deleteLike(user_Id, id) {
    const article_Id = id;
    console.log("user_Id:", user_Id, "article_Id:", article_Id);
    try {
      const response = await fetch(LIKES_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_Id, article_Id }) 
      });
      if (!response.ok) {
        throw new Error("Failed to delete like");
      }
      console.log("Like deleted");
      // change the value of buttonClick
      buttonClick = buttonClick === 1 ? 0 : 1;
    } catch (error) {
      console.error("Error delete like:", error);
    }
  }

  //reactive: "The function re-executes when any of the three variables change, displaying the like count and whether the article is liked."
  $: if (id && user_Id && buttonClick !== null) {
    getLikes(id);
    checkIsLiked(user_Id, id);
  }
</script>

<!-- article part -->
{#if article && !edit}
  <h1>{article.article_title}</h1>
  <h3>Author: {article.username}</h3>
  {@html article.content}
  <p>{article.createdAt}</p>

  <!-- like part -->
  <span>{likeCount} likes</span>
  {#if isLiked}
    <button on:click={() => deleteLike(user_Id, id)}>Unlike</button>
    <p>You have liked this article</p>
  {:else}
    <button on:click={() => addLike(user_Id, id)}>Give this article a like</button>
    <p>You have not liked yet, you can like this article</p>
  {/if}

  <button on:click={() => (edit = true)}>edit</button>

  <!-- delete part -->
  <span><button on:click={deleteArticle}>Delete my article</button></span>
  <br />
  <br />
{:else if article && edit}
  <EditArticle articleId={id} />
{:else}
  <p>Loading...</p>
{/if}

<!-- comments part -->
{#if edit == false}
  {#if isLoggedIn && name == author}
    {#if article && id && user}
      <CommentsDeleteAll {user} articleId={id} />
    {:else}
      <p>Loading...</p>
    {/if}
  {/if}
{:else}
  <p>Editing...</p>
{/if}

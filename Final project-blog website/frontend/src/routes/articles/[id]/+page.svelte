<script>
  export let data;
  import { page } from "$app/stores";
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  import ArticleView from "$lib/components/ArticleView.svelte";
  import Comments from "$lib/components/Comments.svelte";
  let article = data.article
  console.log(article);
</script>





{#if data.article}
  <h1>{data.article.article_title}</h1>
  <p>{data.article.content}</p>
{:else}
  <p>文章加载失败</p>
{/if}

<!-- <div>
  <ArticleView articleId={articleId} />
  <Comments user={data.user} articleId={articleId} />
</div> -->
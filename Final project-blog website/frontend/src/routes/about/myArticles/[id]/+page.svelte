<script>
import { page } from "$app/stores";
import { ARTICLES_URL } from "$lib/js/api-urls.js";
import ArticleView from "$lib/components/ArticleView.svelte";
import Comments from "$lib/components/Comments.svelte";
export let data;
let articleId;
$: articleId = $page.params.id;
console.log(articleId);
</script>

<div>
  <ArticleView articleId={articleId} />
  <Comments user={data.user} articleId={articleId} />
</div>






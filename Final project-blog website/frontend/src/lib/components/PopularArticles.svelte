<script>
  import { onMount } from "svelte";
  import { ARTICLES_URL, LIKES_URL } from "$lib/js/api-urls.js";

  let topArticles = [];
  let defaultImage = "/picture3.jpeg";

  async function fetchTopLikedArticles() {
    try {
      const response = await fetch(ARTICLES_URL, { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch articles");
      let articles = await response.json();

      for (let article of articles) {
        const likeResponse = await fetch(`${LIKES_URL}/${article.id}`, { method: "GET" });
        if (likeResponse.ok) {
          const likeData = await likeResponse.json();
          article.likes = likeData.count;
        } else {
          article.likes = 0;
        }

        const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/i;
        const match = imgRegex.exec(article.content);
        article.backgroundUrl = match ? match[1] : defaultImage;

        const plainText = article.content.replace(/<\/?[^>]+(>|$)/g, "");
        article.preview = plainText.length > 50 ? plainText.slice(0, 50) + "..." : plainText;
      }

      topArticles = articles.sort((a, b) => b.likes - a.likes).slice(0, 9);
    } catch (error) {
      console.error("Error fetching top liked articles:", error);
    }
  }

  onMount(fetchTopLikedArticles);
</script>

<div class="article-grid">
  {#each topArticles as article}
    <a href={`/articles/${article.id}`} class="article-card">
      <div
        class="article-image"
        style="background-image: url({article.backgroundUrl || defaultImage});"
      ></div>
      <div class="article-content">
        <h2>{article.article_title}</h2>
        <p>🐾 {article.likes} Likes</p>
        <p class="preview">{article.preview}</p>
      </div>
    </a>
  {/each}
</div>

<style>
  .article-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 5px;
    row-gap: 30px;
    padding: 10px;
  }

  .article-card {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    text-decoration: none;
    background: white;
  }

  .article-image {
    width: 100%;
    height: 300px; 
    background-size: cover;
    background-position: center;
  }

  .article-content {
    padding: 12px;
  }

  h2 {
    font-size: 20px;
    color: #2d3748;
    margin: 0.5rem 0;
  }

  p {
    font-size: 16px;
    color: #4a5568;
    margin: 0.5rem 0;
  }

  .preview {
    font-size: 14px;
    color: #718096;
  }

  @media (max-width: 768px) {
    .article-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 480px) {
    .article-grid {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
</style>

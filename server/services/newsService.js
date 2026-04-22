import axios from 'axios';

const GNEWS_API = 'https://gnews.io/api/v4';

/**
 * Search news articles using GNews API
 * Falls back to generating search links if no API key
 */
export async function searchNews(query) {
  if (!process.env.GNEWS_API_KEY) {
    return generateNewsLinks(query);
  }

  try {
    const response = await axios.get(`${GNEWS_API}/search`, {
      params: {
        q: query,
        lang: 'en',
        max: 10,
        apikey: process.env.GNEWS_API_KEY
      },
      timeout: 10000
    });

    return {
      source: 'gnews_api',
      totalResults: response.data.totalArticles,
      articles: response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content?.substring(0, 300),
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name,
          url: article.source.url
        }
      }))
    };
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 429) {
      console.warn('GNews API limit reached, falling back to links');
      return generateNewsLinks(query);
    }
    throw error;
  }
}

/**
 * Generate search links for major news sites
 */
function generateNewsLinks(query) {
  const encodedQuery = encodeURIComponent(query);

  return {
    source: 'generated_links',
    totalResults: null,
    articles: [],
    searchLinks: [
      {
        name: 'Google News',
        url: `https://news.google.com/search?q=${encodedQuery}`,
        icon: '📰'
      },
      {
        name: 'Bing News',
        url: `https://www.bing.com/news/search?q=${encodedQuery}`,
        icon: '🔍'
      },
      {
        name: 'Reuters',
        url: `https://www.reuters.com/site-search/?query=${encodedQuery}`,
        icon: '🌐'
      },
      {
        name: 'Associated Press',
        url: `https://apnews.com/search#?q=${encodedQuery}`,
        icon: '📡'
      },
      {
        name: 'BBC News',
        url: `https://www.bbc.co.uk/search?q=${encodedQuery}`,
        icon: '📺'
      },
      {
        name: 'DuckDuckGo News',
        url: `https://duckduckgo.com/?q=${encodedQuery}&t=h_&iar=news&ia=news`,
        icon: '🦆'
      }
    ]
  };
}

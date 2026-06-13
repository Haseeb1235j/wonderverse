// Wikipedia Service Layer for WonderVerse
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const WIKI_REST = 'https://en.wikipedia.org/api/rest_v1';

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    console.error(`Fetch error for ${url}:`, error);
    return null;
  }
}

export const WikipediaService = {
  // Rich Search: Returns up to 10 results with extracts and thumbnails
  async search(query) {
    const url = `${WIKI_API}?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=200&pilimit=10&exintro&explaintext&exsentences=2&exlimit=10&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      const data = await res.json();
      const pagesObj = data.query?.pages || {};
      const searchHits = Object.values(pagesObj)
        .sort((a, b) => (a.index || 0) - (b.index || 0))
        .map(page => ({
          title: page.title,
          snippet: page.extract || "",
          thumbnail: page.thumbnail?.source || null
        }));
      
      if (searchHits.length > 0) {
        return searchHits;
      }
      
      // Fallback search list if generator is empty
      const listUrl = `${WIKI_API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=10`;
      const listRes = await fetchWithTimeout(listUrl);
      if (!listRes) return null;
      const listData = await listRes.json();
      const hits = listData.query?.search || [];
      return hits.map(hit => ({
        title: hit.title,
        snippet: hit.snippet.replace(/<span class="searchmatch">/g, "").replace(/<\/span>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
        thumbnail: null
      }));
    } catch (e) {
      console.error("Failed to parse search data", e);
      return null;
    }
  },

  // SUMMARY: Full topic data (title, extract, image, description, url)
  async getSummary(title) {
    const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
    const url = `${WIKI_REST}/page/summary/${formattedTitle}`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      return await res.json();
    } catch (e) {
      console.error("Failed to parse summary data", e);
      return null;
    }
  },

  // RELATED TOPICS: Wikipedia links from a page (get first 20)
  async getRelated(title) {
    const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(title)}&prop=links&pllimit=20&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      return await res.json();
    } catch (e) {
      console.error("Failed to parse links data", e);
      return null;
    }
  },

  // IMAGES: Get images from a page
  async getImages(title) {
    const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(title)}&prop=images&imlimit=10&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      return await res.json();
    } catch (e) {
      console.error("Failed to parse images data", e);
      return null;
    }
  },

  // CATEGORIES: Get topic categories
  async getCategories(title) {
    const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(title)}&prop=categories&cllimit=10&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      return await res.json();
    } catch (e) {
      console.error("Failed to parse categories data", e);
      return null;
    }
  },

  // MULTIPLE SEARCHES: For related topics suggestions
  async searchMultiple(queries) {
    const promises = queries.map(q => this.search(q));
    return Promise.allSettled(promises);
  }
};

// Main function: fetch everything for a topic page at once
export async function fetchTopicData(title, query = "") {
  try {
    const [summaryResult, relatedResult, categoriesResult] = await Promise.allSettled([
      WikipediaService.getSummary(title),
      WikipediaService.getRelated(title),
      WikipediaService.getCategories(title)
    ]);

    const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
    const related = relatedResult.status === 'fulfilled' ? relatedResult.value : null;
    const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : null;

    return {
      summary,
      related,
      categories,
      query,
      title,
      fetchedAt: Date.now()
    };
  } catch (error) {
    console.error("Data aggregation error on fetchTopicData", error);
    return {
      summary: null,
      related: null,
      categories: null,
      query,
      title,
      fetchedAt: Date.now()
    };
  }
}

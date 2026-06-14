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

  // GET SECTIONS: Get parsed sections list
  async getSections(title) {
    const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(title)}&prop=sections&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      const data = await res.json();
      return data.parse?.sections || [];
    } catch (e) {
      console.error("Failed to parse sections list", e);
      return null;
    }
  },

  // GET SECTION TEXT: Get HTML content of a specific section
  async getSectionText(title, index) {
    const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(title)}&prop=text&section=${index}&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      const data = await res.json();
      return data.parse?.text?.["*"] || "";
    } catch (e) {
      console.error(`Failed to parse section ${index} text`, e);
      return null;
    }
  },

  // GET MEDIA LIST: Get page image references and URLs
  async getMediaList(title) {
    const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
    const url = `${WIKI_REST}/page/media-list/${formattedTitle}`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      return await res.json();
    } catch (e) {
      console.error("Failed to parse media list data", e);
      return null;
    }
  },

  // GET VIDEOS: Get video listings from Wikimedia Commons matching a query
  async getVideos(title, category = "") {
    const queryTerm = title.trim();
    const commonsApi = 'https://commons.wikimedia.org/w/api.php';
    let url = `${commonsApi}?action=query&generator=search&gsrsearch=${encodeURIComponent(queryTerm)}+filetype:video&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|mime&format=json&origin=*`;
    
    let res = await fetchWithTimeout(url);
    let data = res ? await res.json() : null;
    let pages = data?.query?.pages || {};
    let videoFiles = [];
    
    for (const page of Object.values(pages)) {
      const info = page.imageinfo?.[0];
      if (info && info.url && (info.mime?.startsWith('video/') || info.url.endsWith('.webm') || info.url.endsWith('.ogv') || info.url.endsWith('.mp4'))) {
        videoFiles.push({
          title: page.title.replace('File:', '').replace(/_/g, ' '),
          url: info.url,
          mime: info.mime || (info.url.endsWith('.webm') ? 'video/webm' : info.url.endsWith('.ogv') ? 'video/ogg' : 'video/mp4')
        });
      }
    }
    
    // Fallback 1: Try searching category name
    if (videoFiles.length === 0 && category) {
      const fallbackUrl = `${commonsApi}?action=query&generator=search&gsrsearch=${encodeURIComponent(category)}+filetype:video&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|mime&format=json&origin=*`;
      const fallbackRes = await fetchWithTimeout(fallbackUrl);
      const fallbackData = fallbackRes ? await fallbackRes.json() : null;
      const fallbackPages = fallbackData?.query?.pages || {};
      
      for (const page of Object.values(fallbackPages)) {
        const info = page.imageinfo?.[0];
        if (info && info.url && (info.mime?.startsWith('video/') || info.url.endsWith('.webm') || info.url.endsWith('.ogv') || info.url.endsWith('.mp4'))) {
          videoFiles.push({
            title: page.title.replace('File:', '').replace(/_/g, ' '),
            url: info.url,
            mime: info.mime || (info.url.endsWith('.webm') ? 'video/webm' : info.url.endsWith('.ogv') ? 'video/ogg' : 'video/mp4')
          });
        }
      }
    }

    // Fallback 2: Try searching global keyword "Science" so they always get at least one video!
    if (videoFiles.length === 0) {
      const globalUrl = `${commonsApi}?action=query&generator=search&gsrsearch=Science+filetype:video&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|mime&format=json&origin=*`;
      const globalRes = await fetchWithTimeout(globalUrl);
      const globalData = globalRes ? await globalRes.json() : null;
      const globalPages = globalData?.query?.pages || {};
      
      for (const page of Object.values(globalPages)) {
        const info = page.imageinfo?.[0];
        if (info && info.url && (info.mime?.startsWith('video/') || info.url.endsWith('.webm') || info.url.endsWith('.ogv') || info.url.endsWith('.mp4'))) {
          videoFiles.push({
            title: page.title.replace('File:', '').replace(/_/g, ' '),
            url: info.url,
            mime: info.mime || (info.url.endsWith('.webm') ? 'video/webm' : info.url.endsWith('.ogv') ? 'video/ogg' : 'video/mp4')
          });
        }
      }
    }
    
    return videoFiles;
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

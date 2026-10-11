// Wikipedia Service Layer for WonderVerse
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const WIKI_REST = "https://en.wikipedia.org/api/rest_v1";

function normalizeQuery(query) {
  if (!query) return query;
  const q = query.trim().toLowerCase();
  const shorthand = {
    ai: "Artificial intelligence",
    ml: "Machine learning",
    vr: "Virtual reality",
    ar: "Augmented reality",
    mr: "Mixed reality",
    ui: "User interface",
    ux: "User experience",
    pc: "Personal computer",
    cpu: "Central processing unit",
    gpu: "Graphics processing unit",
    ram: "Random-access memory",
    dna: "Deoxyribonucleic acid",
  };
  return shorthand[q] || query;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response.ok ? response : null;
  } catch (error) {
    clearTimeout(id);
    console.error(`Fetch error for ${url}:`, error);
    return null;
  }
}

export const WikipediaService = {
  // Rich Search: Returns up to 10 results with extracts and thumbnails
  async search(query, { allowSuggestion = true } = {}) {
    const normalized = normalizeQuery(query);
    const url = `${WIKI_API}?action=query&generator=search&gsrsearch=${encodeURIComponent(normalized)}&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=200&pilimit=10&exintro&explaintext&exsentences=2&exlimit=10&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      const data = await res.json();
      if (data.error) return null;
      const pagesObj = data.query?.pages || {};
      const searchHits = Object.values(pagesObj)
        .sort((a, b) => (a.index || 0) - (b.index || 0))
        .map((page) => ({
          title: page.title,
          snippet: page.extract || "",
          thumbnail: page.thumbnail?.source || null,
        }));

      if (searchHits.length > 0 && !allowSuggestion) {
        return searchHits;
      }

      // Read spelling metadata even when a misspelling returns weak matches.
      const listUrl = `${WIKI_API}?action=query&list=search&srsearch=${encodeURIComponent(normalized)}&srinfo=totalhits|suggestion&format=json&origin=*&srlimit=10`;
      const listRes = await fetchWithTimeout(listUrl);
      if (!listRes) return searchHits.length ? searchHits : null;
      const listData = await listRes.json();
      if (listData.error) return searchHits.length ? searchHits : null;
      const hits = listData.query?.search || [];
      const suggestion = listData.query?.searchinfo?.suggestion;
      // Use the search engine's correction, never a locally invented article title.
      // One correction attempt only; the caller shows it as a suggestion to choose.
      if (
        allowSuggestion &&
        typeof suggestion === "string" &&
        suggestion.trim() &&
        suggestion.trim().toLowerCase() !==
          String(normalized).trim().toLowerCase()
      ) {
        const suggestedHits = await this.search(suggestion, {
          allowSuggestion: false,
        });
        if (suggestedHits?.length)
          return suggestedHits.map((hit) => ({
            ...hit,
            suggestedQuery: suggestion,
          }));
        if (!searchHits.length && !hits.length) return suggestedHits;
      }
      if (searchHits.length) return searchHits;
      return hits.map((hit) => ({
        title: hit.title,
        snippet: hit.snippet
          .replace(/<span class="searchmatch">/g, "")
          .replace(/<\/span>/g, "")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&"),
        thumbnail: null,
      }));
    } catch (e) {
      console.error("Failed to parse search data", e);
      return null;
    }
  },

  // SUMMARY: Full topic data (title, extract, image, description, url)
  async getSummary(title) {
    const formattedTitle = encodeURIComponent(title.replace(/ /g, "_"));
    const url = `${WIKI_REST}/page/summary/${formattedTitle}`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      const summary = await res.json();
      return typeof summary.title === "string" &&
        typeof summary.extract === "string"
        ? summary
        : null;
    } catch (e) {
      console.error("Failed to parse summary data", e);
      return null;
    }
  },

  // GET LEAD EXTRACT: Get full detailed introduction text of a page
  async getLeadExtract(title) {
    const article = await this.getLeadArticle(title);
    return article?.extract || "";
  },

  async getLeadArticle(title) {
    const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(title)}&prop=extracts|revisions&rvprop=ids|timestamp&exintro&explaintext&redirects=1&format=json&origin=*`;
    const res = await fetchWithTimeout(url);
    if (!res) return null;
    try {
      const data = await res.json();
      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0];
      if (data.error || !page?.extract) return null;
      return {
        extract: page.extract,
        revision: page.revisions?.[0]?.revid || null,
        timestamp: page.revisions?.[0]?.timestamp || null,
      };
    } catch (e) {
      console.error("Failed to parse lead extract", e);
      return null;
    }
  },

  // RELATED TOPICS: Wikipedia links from a page (get first 20)
  async getRelated(title) {
    const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(title)}&prop=links&plnamespace=0&pllimit=20&format=json&origin=*`;
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
    const formattedTitle = encodeURIComponent(title.replace(/ /g, "_"));
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
    const commonsApi = "https://commons.wikimedia.org/w/api.php";
    let url = `${commonsApi}?action=query&generator=search&gsrsearch=${encodeURIComponent(queryTerm)}+filetype:video&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|mime|thumburl&iiurlwidth=400&format=json&origin=*`;

    let res = await fetchWithTimeout(url);
    if (!res) return [];
    let data;
    try {
      data = await res.json();
    } catch {
      return [];
    }
    let pages = data?.query?.pages || {};
    let videoFiles = [];

    for (const page of Object.values(pages)) {
      const info = page.imageinfo?.[0];
      if (
        info &&
        info.url &&
        (info.mime?.startsWith("video/") ||
          info.url.endsWith(".webm") ||
          info.url.endsWith(".ogv") ||
          info.url.endsWith(".mp4"))
      ) {
        videoFiles.push({
          title: page.title.replace("File:", "").replace(/_/g, " "),
          url: info.url,
          mime:
            info.mime ||
            (info.url.endsWith(".webm")
              ? "video/webm"
              : info.url.endsWith(".ogv")
                ? "video/ogg"
                : "video/mp4"),
          thumbnail: info.thumburl || null,
        });
      }
    }

    // An empty topic-specific result is preferable to unrelated footage.
    return videoFiles;
  },

  // MULTIPLE SEARCHES: For related topics suggestions
  async searchMultiple(queries) {
    const promises = queries.map((q) => this.search(q));
    return Promise.allSettled(promises);
  },
};

// Main function: fetch everything for a topic page at once
export async function fetchTopicData(title, query = "") {
  let finalTitle = normalizeQuery(title);
  try {
    let summary = null;
    let leadExtract = "";

    // Fetch summary first
    const summaryRes = await WikipediaService.getSummary(finalTitle);
    if (summaryRes) {
      summary = summaryRes;

      // Ask the reader to choose a meaning instead of guessing an article.
      if (summary.type === "disambiguation") {
        return {
          summary,
          choices: await WikipediaService.search(finalTitle),
          title: finalTitle,
          query,
          fetchedAt: Date.now(),
        };
      }
      finalTitle = summary.title;
    } else {
      // A misspelled/noncanonical title is not an article. Offer actual search
      // matches instead of silently picking one or generating missing facts.
      return {
        summary: null,
        choices: await WikipediaService.search(finalTitle),
        title: finalTitle,
        query,
        fetchedAt: Date.now(),
      };
    }

    // Fetch lead extract, related, and categories for finalTitle
    const [leadRes, relatedRes, categoriesRes] = await Promise.allSettled([
      WikipediaService.getLeadArticle(finalTitle),
      WikipediaService.getRelated(finalTitle),
      WikipediaService.getCategories(finalTitle),
    ]);

    const articleSource = leadRes.status === "fulfilled" ? leadRes.value : null;
    leadExtract = articleSource?.extract || "";
    const related = relatedRes.status === "fulfilled" ? relatedRes.value : null;
    const categories =
      categoriesRes.status === "fulfilled" ? categoriesRes.value : null;

    return {
      summary,
      leadExtract,
      articleSource,
      related,
      categories,
      query,
      title: finalTitle,
      fetchedAt: Date.now(),
    };
  } catch (error) {
    console.error("Data aggregation error on fetchTopicData", error);
    return {
      summary: null,
      leadExtract: "",
      related: null,
      categories: null,
      query,
      title: finalTitle,
      fetchedAt: Date.now(),
    };
  }
}

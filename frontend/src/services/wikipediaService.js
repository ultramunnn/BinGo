import axios from "axios";

const WIKI_REST_BASE = "https://en.wikipedia.org/api/rest_v1";
const WIKI_ACTION_BASE = "https://en.wikipedia.org/w/api.php";

const DEFAULT_THUMBNAIL = null;

/**
 * Create an axios instance with shared config.
 * Includes timeout and default params for MediaWiki action API.
 */
const wikiClient = axios.create({
  timeout: 10000,
  params: { origin: "*" },
});

/**
 * Search Wikipedia articles by query string.
 * Uses MediaWiki action API with opensearch.
 *
 * @param {string} query - Search term
 * @param {number} limit - Max results (default 5)
 * @param {AbortSignal} signal - AbortController signal
 * @returns {Promise<Array>} Array of { title, pageId } objects
 */
export async function searchArticles(query, limit = 5, signal) {
  const { data } = await wikiClient.get(WIKI_ACTION_BASE, {
    params: {
      action: "query",
      list: "search",
      srsearch: query,
      srlimit: limit,
      srinfo: "totalhits",
      srprop: "snippet",
      format: "json",
    },
    signal,
  });

  if (!data?.query?.search) return [];

  return data.query.search.map((item) => ({
    title: item.title,
    pageId: item.pageid,
  }));
}

/**
 * Fetch article summary from Wikipedia REST API.
 * Returns title, extract, thumbnail, description, and content URL.
 *
 * @param {string} title - Article title (URL-encoded internally)
 * @param {AbortSignal} signal - AbortController signal
 * @returns {Promise<Object|null>} Normalized article object or null
 */
export async function getArticleSummary(title, signal) {
  try {
    const encodedTitle = encodeURIComponent(title);
    const { data } = await wikiClient.get(
      `${WIKI_REST_BASE}/page/summary/${encodedTitle}`,
      { signal }
    );

    return normalizeSummary(data);
  } catch (err) {
    if (axios.isCancel(err)) throw err;
    return null;
  }
}

/**
 * Batch fetch summaries for multiple article titles.
 * Runs requests in parallel with Promise.allSettled.
 *
 * @param {string[]} titles - Array of article titles
 * @param {AbortSignal} signal - AbortController signal
 * @returns {Promise<Array>} Array of normalized article objects
 */
export async function getArticleSummaries(titles, signal) {
  const promises = titles.map((title) => getArticleSummary(title, signal));
  const results = await Promise.allSettled(promises);

  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);
}

/**
 * Combined search: find articles by query, then fetch their summaries.
 *
 * @param {string} query - Search term
 * @param {number} limit - Max results
 * @param {AbortSignal} signal - AbortController signal
 * @returns {Promise<Array>} Array of article objects with summaries
 */
export async function searchAndGetSummaries(query, limit = 5, signal) {
  const searchResults = await searchArticles(query, limit, signal);

  if (searchResults.length === 0) return [];

  const titles = searchResults.map((r) => r.title);
  return getArticleSummaries(titles, signal);
}

/**
 * Normalize Wikipedia REST summary response into a consistent shape.
 */
function normalizeSummary(raw) {
  return {
    id: raw.pageid,
    title: raw.title,
    extract: raw.extract || "",
    description: raw.description || "",
    thumbnail: raw.thumbnail?.source || DEFAULT_THUMBNAIL,
    thumbnailWidth: raw.thumbnail?.width || 0,
    thumbnailHeight: raw.thumbnail?.height || 0,
    url: raw.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(raw.title)}`,
    lang: raw.lang || "en",
    type: raw.type || "standard",
    timestamp: raw.timestamp || null,
  };
}

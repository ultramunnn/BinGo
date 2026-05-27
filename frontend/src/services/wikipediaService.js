import axios from "axios";

const WIKI_REST_BASE = "https://en.wikipedia.org/api/rest_v1";
const WIKI_ACTION_BASE = "https://en.wikipedia.org/w/api.php";

const DEFAULT_THUMBNAIL = null;

const wikiClient = axios.create({
  timeout: 10000,
  params: { origin: "*" },
});

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

export async function getArticleSummaries(titles, signal) {
  const promises = titles.map((title) => getArticleSummary(title, signal));
  const results = await Promise.allSettled(promises);

  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);
}

export async function searchAndGetSummaries(query, limit = 5, signal) {
  const searchResults = await searchArticles(query, limit, signal);

  if (searchResults.length === 0) return [];

  const titles = searchResults.map((r) => r.title);
  return getArticleSummaries(titles, signal);
}

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

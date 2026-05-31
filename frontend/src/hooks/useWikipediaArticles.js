import { useState, useEffect, useRef, useCallback } from "react";
import { searchAndGetSummaries } from "../services/wikipediaService";
import { WIKI_TOPICS } from "../constants/wikipediaTopics";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function useWikipediaArticles(activeTopicId = "all", articlesPerTopic = 2) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchArticles = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const cacheKey = `${activeTopicId}-${articlesPerTopic}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setArticles(cached);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const topics = activeTopicId === "all"
        ? WIKI_TOPICS
        : WIKI_TOPICS.filter((t) => t.id === activeTopicId);

      const allResults = [];

      for (const topic of topics) {
        const query = topic.searchQueries[0];
        const results = await searchAndGetSummaries(
          query,
          articlesPerTopic,
          controller.signal
        );

        const tagged = results.map((article) => ({
          ...article,
          topicId: topic.id,
          category: topic.category,
          color: topic.color,
        }));

        allResults.push(...tagged);
      }

      if (!controller.signal.aborted) {
        const unique = Array.from(
          new Map(allResults.map((a) => [a.id, a])).values()
        );
        setCache(cacheKey, unique);
        setArticles(unique);
      }
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError("Gagal memuat artikel dari Wikipedia. Coba lagi nanti.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [activeTopicId, articlesPerTopic]);

  useEffect(() => {
    fetchArticles();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchArticles]);

  return { articles, loading, error, refetch: fetchArticles };
}

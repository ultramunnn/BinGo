import { useState, useEffect, useRef, useCallback } from "react";
import { getArticleDetail } from "../services/wikipediaService";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const detailCache = new Map();

function getCached(key) {
  const entry = detailCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    detailCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  detailCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Custom hook to fetch a single Wikipedia article detail (summary + sections).
 *
 * @param {string} title - Wikipedia article title (URL-encoded in route)
 * @returns {{ article: Object|null, loading: boolean, error: string|null, refetch: Function }}
 */
export function useArticleDetail(title) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchDetail = useCallback(async () => {
    if (!title) {
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const decodedTitle = decodeURIComponent(title);
    const cacheKey = `detail:${decodedTitle}`;
    const cached = getCached(cacheKey);

    if (cached) {
      setArticle(cached);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getArticleDetail(decodedTitle, controller.signal);

      if (!controller.signal.aborted) {
        if (result) {
          setCache(cacheKey, result);
          setArticle(result);
        } else {
          setError("Artikel tidak ditemukan di Wikipedia.");
        }
      }
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError("Gagal memuat artikel. Coba lagi nanti.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [title]);

  useEffect(() => {
    fetchDetail();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchDetail]);

  return { article, loading, error, refetch: fetchDetail };
}

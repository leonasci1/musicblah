// src/hooks/usePosts.ts
import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

export function usePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, refetch: fetchPosts };
}

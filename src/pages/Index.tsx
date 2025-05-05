// src/pages/Index.tsx

import React from "react";
import { getAuthUrl } from "@/services/spotify";
import { usePosts } from "@/hooks/usePosts";
import CreatePostInput from "@/components/post/CreatePostInput";
import PostList from "@/components/post/PostList";
import { TrendingSongs } from "@/components/trending/TrendingSongs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Index() {
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    refetch,
  } = usePosts();

  const handleSpotifyLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Feed principal */}
      <main className="flex-1 space-y-4">
        {/* Composer de texto livre */}
        <CreatePostInput onSuccess={refetch} />

        {/* Erro ao carregar posts */}
        {postsError && (
          <p className="text-red-500">Erro ao carregar posts. Tente novamente.</p>
        )}

        {/* Lista de posts */}
        <PostList
          posts={posts}
          loading={postsLoading}
          onDeleted={() => {
            refetch();
          }}
        />
      </main>

      {/* Sidebar (aparece somente em telas md+) */}
      <aside className="hidden md:block w-80 space-y-4">
        {/* Card de Spotify */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Conecte-se ao Spotify
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSpotifyLogin} className="w-full">
              Login com Spotify
            </Button>

            <TrendingSongs />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

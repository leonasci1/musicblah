// src/components/post/PostList.tsx

import React from "react";
import { MusicPost } from "./MusicPost";

interface Post {
  _id: string;
  author: { id: string; username: string; name?: string; avatar?: string };
  text: string;
  createdAt: string;
  likes: any[];
  comments: any[];
  spotifyData?: {
    title: string;
    artist: string;
    album: string;
    cover: string;
    duration?: number;
    preview_url?: string;
  };
}

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onDeleted: (postId: string) => void; // Atualiza o feed após exclusão
}

export default function PostList({ posts, loading, onDeleted }: PostListProps) {
  if (loading) return <p>Carregando posts...</p>;
  if (posts.length === 0) return <p>Nenhum post ainda.</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <MusicPost
          key={post._id}
          postId={post._id}
          user={post.author}
          content={post.text}
          timestamp={post.createdAt}
          likes={post.likes.length}
          comments={post.comments.length}
          music={post.spotifyData}
          onDeleted={() => onDeleted(post._id)} // Passa o ID do post excluído
        />
      ))}
    </div>
  );
}

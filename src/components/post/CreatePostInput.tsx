// src/components/post/CreatePostInput.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, Image, Smile } from "lucide-react";
import { api } from "@/services/api";

interface CreatePostInputProps {
  onSuccess: () => void;
}

export default function CreatePostInput({ onSuccess }: CreatePostInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return; // Não envia post vazio

    try {
      // Usa a instância `api` que já possui o header Authorization configurado
      const res = await api.post("/posts", { text: content });
      console.log("Post criado:", res.data);
      setContent("");
      onSuccess(); // Recarrega o feed
    } catch (err: any) {
      console.error("Erro ao criar post:", err);
      const status = err.response?.status;
      if (status === 401) {
        alert("Sessão expirada. Faça login novamente.");
      } else if (status === 403) {
        alert("Você precisa estar logado para publicar.");
      } else {
        alert(err.response?.data?.error || "Erro ao criar post.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>UM</AvatarFallback>
        </Avatar>
        <Textarea
          placeholder="O que você está ouvindo?"
          className="flex-1 resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full text-music-purple">
            <Music className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Image className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <Button type="submit" className="music-gradient" disabled={!content.trim()}>
          Publicar
        </Button>
      </div>
    </form>
  );
}

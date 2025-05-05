// src/components/post/PostComposer.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

export default function PostComposer({ onSuccess }: { onSuccess: () => void }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<any>(null);

  const validate = async () => {
    try {
      const res = await api.post("/spotify/validate", { url });
      setPreview(res.data);
    } catch {
      setPreview(null);
    }
  };

  const publish = async () => {
    try {
      await api.post("/posts", { spotifyUrl: url, text });
      setUrl("");
      setText("");
      setPreview(null);
      onSuccess();               // << notifica o pai
    } catch (err) {
      console.error("Erro ao publicar post:", err);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <input
        value={url}
        onBlur={validate}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Link Spotify"
        className="w-full mb-2 p-2 border rounded"
      />
      {preview && <div className="mb-2 text-sm text-gray-500">Preview: {preview.name}</div>}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva seu post aqui"
        className="w-full mb-2 resize-none border rounded"
        rows={3}
      />
      <Button
        onClick={publish}
        disabled={!preview}
        className="w-full bg-purple-600 hover:bg-purple-700 text-gray-100"
      >
        Publicar
      </Button>
    </div>
  );
}

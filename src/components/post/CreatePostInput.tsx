
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, Image, Smile } from "lucide-react";

export function CreatePostInput() {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Post submitted:", content);
    setContent("");
    // Here we would handle the actual post creation
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
        
        <Button 
          type="submit" 
          className="music-gradient" 
          disabled={content.trim().length === 0}
        >
          Publicar
        </Button>
      </div>
    </form>
  );
}

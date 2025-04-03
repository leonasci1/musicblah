
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="music-gradient rounded-full p-3">
        <Music className="h-12 w-12 text-white" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-muted-foreground">
        Parece que você se perdeu na melodia. Vamos voltar para a batida principal?
      </p>
      <Link to="/">
        <Button className="mt-6 music-gradient">Voltar para o início</Button>
      </Link>
    </div>
  );
}

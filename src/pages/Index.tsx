import { MusicPost } from "@/components/post/MusicPost";
import { CreatePostInput } from "@/components/post/CreatePostInput";
import { NowPlaying } from "@/components/post/NowPlaying";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuthUrl } from "@/services/spotify";
import { TrendingSongs } from "@/components/trending/TrendingSongs";

function login() {
  // Redireciona o usuário para a URL de autenticação do Spotify
  window.location.href = getAuthUrl();
}

export function SpotifyLoginButton() {
  return (
    <Button onClick={login}>
      Conectar ao Spotify
    </Button>
  );
}

// Mock data
const posts = [
  {
    id: 1,
    user: {
      name: "Ana Silva",
      username: "anasilva",
      avatar: "https://ui-avatars.com/api/?name=Ana+Silva&background=8B5CF6&color=fff",
    },
    content: "Essa música é incrível! Não consigo parar de ouvir.",
    timestamp: "1h atrás",
    likes: 24,
    comments: 5,
    music: {
      title: "Se Eu For Eu Vou Com Você",
      artist: "Fresno, Nx Zero",
      album: "Eu Nunca Fui Embora",
      cover: "https://i.scdn.co/image/ab67616d0000b2735e53ffef0d2955416ab6d8fa",
      duration: "3:45",
      progress: 30,
    },
  },
  {
    id: 2,
    user: {
      name: "Carlos Mendes",
      username: "carlosmendes",
      avatar: "https://ui-avatars.com/api/?name=Carlos+Mendes&background=0EA5E9&color=fff",
    },
    content: "Descobri esse artista novo e estou obcecado! Recomendo muito ouvir o álbum inteiro.",
    timestamp: "3h atrás",
    likes: 15,
    comments: 3,
    music: {
      title: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
      cover: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Harry_Styles_-_Harry%27s_House.png/220px-Harry_Styles_-_Harry%27s_House.png",
    },
  },
  {
    id: 3,
    user: {
      name: "Maria Oliveira",
      username: "mariaoliveira",
      avatar: "https://ui-avatars.com/api/?name=Maria+Oliveira&background=D946EF&color=fff",
    },
    content: "Esse festival foi incrível, ainda estou pensando nessa apresentação!",
    timestamp: "5h atrás",
    likes: 42,
    comments: 7,
  },
];

const nowPlaying = {
  user: {
    name: "Samirah Fontenele",
    username: "sweetdlibyh",
    avatar: "https://pbs.twimg.com/profile_images/1903626006256058368/xfLZ2ipm_400x400.jpg",
  },
  music: {
    title: "Meet Me in the Hallway",
    artist: "Harry Styles",
    album: "Harry Styles",
    cover: "https://m.media-amazon.com/images/I/71ICZkHhviL.jpg",
    duration: "3:47",
    progress: 45,
  },
};

export default function Index() {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex-1 space-y-4">
        <CreatePostInput />

        <NowPlaying user={nowPlaying.user} music={nowPlaying.music} />

        <div className="space-y-4">
          {posts.map((post) => (
            <MusicPost
              key={post.id}
              user={post.user}
              content={post.content}
              timestamp={post.timestamp}
              likes={post.likes}
              comments={post.comments}
              music={post.music}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:block w-80 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Músicas em Alta</CardTitle>
            <SpotifyLoginButton />
          </CardHeader>
          <TrendingSongs />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sugestões para Seguir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                name: "Juliana Lima",
                username: "julima",
                avatar: "https://ui-avatars.com/api/?name=Juliana+Lima&background=6366F1&color=fff",
              },
              {
                name: "Roberto Alves",
                username: "robalves",
                avatar: "https://ui-avatars.com/api/?name=Roberto+Alves&background=8B5CF6&color=fff",
              },
              {
                name: "Laura Santos",
                username: "laurasantos",
                avatar: "https://ui-avatars.com/api/?name=Laura+Santos&background=0EA5E9&color=fff",
              },
            ].map((user) => (
              <div key={user.username} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
                <button className="text-xs font-medium text-music-purple">Seguir</button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
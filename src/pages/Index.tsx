
import { MusicPost } from "@/components/post/MusicPost";
import { CreatePostInput } from "@/components/post/CreatePostInput";
import { NowPlaying } from "@/components/post/NowPlaying";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      cover: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/The_Weeknd_-_After_Hours.png/220px-The_Weeknd_-_After_Hours.png",
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
    name: "Pedro Costa",
    username: "pedrocosta",
    avatar: "https://ui-avatars.com/api/?name=Pedro+Costa&background=F87171&color=fff",
  },
  music: {
    title: "Levitating",
    artist: "Dua Lipa ft. DaBaby",
    album: "Future Nostalgia",
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png/220px-Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
    duration: "3:23",
    progress: 45,
  },
};

const trendingSongs = [
  "Flowers - Miley Cyrus",
  "Kill Bill - SZA",
  "Anti-Hero - Taylor Swift",
  "Creepin' - Metro Boomin, The Weeknd",
  "Unholy - Sam Smith, Kim Petras",
];

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
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {trendingSongs.map((song, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-music-purple/10 text-music-purple text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm">{song}</span>
                </li>
              ))}
            </ul>
          </CardContent>
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

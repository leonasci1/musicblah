
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { MusicStats } from "@/components/stats/MusicStats";
import { MusicPost } from "@/components/post/MusicPost";

// Mock user data
const user = {
  name: "Leandremo",
  username: "leandremo",
  avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2NcYvsA-Dl2WyQfzhRh_Xa08irdgE7kvk6bdMSJQFXUA1jWjTM9aPzGUo6PDcRSQGggw&usqp=CAU",
  coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
  bio: "Amante de música e boa vibração ✨ | Rock, Pop e tudo mais | Sempre em busca de novas descobertas musicais",
  followers: 109370,
  following: 187,
  isCurrentUser: true,
};

// Mock posts data
const posts = [
  {
    id: 1,
    user: {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
    content: "como pode algm ter criado essa música?",
    timestamp: "2d atrás",
    likes: 35,
    comments: 8,
    music: {
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      cover: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
    },
  },
  {
    id: 2,
    user: {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
    content: "Minha música favorita de todos os tempos. O que vocês acham?",
    timestamp: "5d atrás",
    likes: 42,
    comments: 13,
    music: {
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      cover: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Lennonalbum_imagine.jpg/220px-Lennonalbum_imagine.jpg",
    },
  },
];

// Mock favorite artists
const favoriteArtists = [
  {
    name: "The Weeknd",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/The_Weeknd_-_2023_-_The_After_Hours_til_Dawn_Tour_%28cropped%29_%28cropped%29.jpg/220px-The_Weeknd_-_2023_-_The_After_Hours_til_Dawn_Tour_%28cropped%29_%28cropped%29.jpg",
  },
  {
    name: "Dua Lipa",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Dua_Lipa_with_Warner_Music.jpg/220px-Dua_Lipa_with_Warner_Music.jpg",
  },
  {
    name: "Arctic Monkeys",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Arctic_Monkeys_live_at_the_Kool_Haus%2C_Toronto%2C_2009.jpg/250px-Arctic_Monkeys_live_at_the_Kool_Haus%2C_Toronto%2C_2009.jpg",
  },
  {
    name: "Billie Eilish",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Billie_Eilish_at_TIFF_2019_%283%29_%28cropped%29.jpg/250px-Billie_Eilish_at_TIFF_2019_%283%29_%28cropped%29.jpg",
  },
  {
    name: "Post Malone",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Post_Malone_at_the_2019_American_Music_Awards.png/220px-Post_Malone_at_the_2019_American_Music_Awards.png",
  },
];

export default function Profile() {
  return (
    <div>
      <ProfileHeader user={user} />
      
      <Tabs defaultValue="posts" className="mb-6 ">
        <TabsList className="grid w-full grid-cols-4 rounded-full bg-background transition-colors duration-200  hover:bg-background opacity-100 cursor-pointer">
          <TabsTrigger value="posts" className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Posts</TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Favoritos</TabsTrigger>
          <TabsTrigger value="artists" className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Artistas</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6 space-y-4">
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
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center rounded-lg border bg-card p-4 shadow-sm music-card-hover">
                <img
                  src={`https://picsum.photos/seed/${i}/300/300`}
                  alt={`Album cover ${i}`}
                  className="h-32 w-32 rounded-md shadow-md"
                />
                <div className="mt-3 text-center">
                  <div className="font-medium">Música Favorita {i}</div>
                  <div className="text-sm text-muted-foreground">Artista {i}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="artists" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {favoriteArtists.map((artist, i) => (
              <div key={i} className="flex flex-col items-center rounded-lg border bg-card p-4 shadow-sm music-card-hover">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="h-24 w-24 rounded-full object-cover shadow-md"
                />
                <div className="mt-3 text-center">
                  <div className="font-medium">{artist.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {50 - i * 5} músicas ouvidas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <MusicStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}

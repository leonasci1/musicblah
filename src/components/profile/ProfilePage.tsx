// src/pages/ProfilePage.tsx

import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { api } from '@/services/api';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import PostList from '@/components/post/PostList';
import CreatePostInput from '@/components/post/CreatePostInput';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  followers: number;
  following: number;
}

export default function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();
  const currentUserId = localStorage.getItem('userId') || '';

  // Se não estiver logado, vai para /login
  if (!currentUserId) {
    return <Navigate to="/login" replace />;
  }

  // Escolhe qual ID buscar: o da rota ou o seu próprio
  const idToFetch = profileId || currentUserId;

  // --- estado do usuário ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // --- estado dos posts ---
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // 1) Busca dados de `user`
  useEffect(() => {
    setUserLoading(true);
    setUserError(null);

    api.get<{ user: UserProfile }>(`/users/${idToFetch}`)
      .then(res => setUser(res.data.user))
      .catch(err => {
        console.error('Erro ao carregar usuário:', err);
        setUserError('Não foi possível carregar o perfil.');
      })
      .finally(() => setUserLoading(false));
  }, [idToFetch]);

  // 2) Assim que `user` estiver carregado com sucesso, busca os posts
  useEffect(() => {
    // Se não há usuário, pula o fetch
    if (!user) {
      setPosts([]);
      setPostsLoading(false);
      return;
    }

    setPostsLoading(true);
    api.get<any[]>(`/posts?author=${idToFetch}`)
      .then(res => setPosts(res.data))
      .catch(err => {
        console.error('Erro ao carregar posts:', err);
      })
      .finally(() => setPostsLoading(false));
  }, [user, idToFetch]);

  // Loading global: se qualquer um dos dois estiver carregando
  if (userLoading || postsLoading) {
    return <p className="p-4">Carregando perfil...</p>;
  }

  // Se deu erro ao buscar o usuário (ou não encontrou), mostra mensagem
  if (userError || !user) {
    return (
      <p className="p-4 text-red-500">
        {userError || 'Perfil não encontrado.'}
      </p>
    );
  }

  // Renderiza o perfil + posts
  return (
    <div className="space-y-6">
      <ProfileHeader
        user={{
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar || '',
          coverImage: user.coverImage || '',
          bio: user.bio || '',
          followers: user.followers,
          following: user.following,
          isCurrentUser: user.id === currentUserId,
        }}
      />

      <div className="max-w-2xl mx-auto space-y-4">
        {user.id === currentUserId && (
          <CreatePostInput
            onSuccess={() => {
              // Recarrega apenas os posts do seu feed
              setPostsLoading(true);
              api.get<any[]>(`/posts?author=${currentUserId}`)
                .then(res => setPosts(res.data))
                .finally(() => setPostsLoading(false));
            }}
          />
        )}

        <PostList
          posts={posts}
          loading={postsLoading}
          onDeleted={() => {
            // Recarrega posts após exclusão
            setPostsLoading(true);
            api.get<any[]>(`/posts?author=${idToFetch}`)
              .then(res => setPosts(res.data))
              .finally(() => setPostsLoading(false));
          }}
        />
      </div>
    </div>
  );
}

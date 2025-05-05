// src/components/profile/ProfileHeader.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    followers: number;
    following: number;
    isCurrentUser: boolean;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="profile-header">
      <div
        className="cover-image h-40 bg-gray-800 bg-cover bg-center"
        style={{ backgroundImage: `url(${user.coverImage})` }}
      />
      <div className="avatar-container -mt-12 flex justify-center">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="h-24 w-24 rounded-full border-4 border-white object-cover"
        />
      </div>
      <div className="text-center mt-4 space-y-2 px-4">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">@{user.username}</p>

        {/* Ajuste aqui: rota dinâmica de perfil */}
        {!user.isCurrentUser && (
          <Link
            to={`/profile/${user.id}`}
            className="text-purple-500 hover:underline"
          >
            Seguir / Ver perfil
          </Link>
        )}

        {user.bio && <p className="mt-2">{user.bio}</p>}

        <div className="flex justify-center space-x-6 mt-4">
          <div>
            <span className="font-bold">{user.followers}</span>
            <span className="ml-1">Seguidores</span>
          </div>
          <div>
            <span className="font-bold">{user.following}</span>
            <span className="ml-1">Seguindo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

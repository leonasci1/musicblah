// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SpotifyCallback from "./pages/SpotifyCallback";
import Login from "./pages/Login";
import Register from "./components/login/register";
import ProfilePage from "./components/profile/ProfilePage";

const queryClient = new QueryClient();

const App = () => {
  const userId = localStorage.getItem('userId') ?? '';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas que usam o layout principal */}
            <Route path="/" element={<MainLayout />}>
              {/* Página inicial */}
              <Route index element={<Index />} />

              {/* Redireciona /profile para /profile/:userId */}
              <Route
                path="profile"
                element={
                  userId
                    ? <Navigate to={`/profile/${userId}`} replace />
                    : <Navigate to="/login" replace />
                }
              />

              {/* Perfil dinâmico de qualquer usuário */}
              <Route path="profile/:profileId" element={<ProfilePage />} />

              {/* Outras rotas do menu (placeholders) */}
              <Route path="listening" element={<NotFound />} />
              <Route path="discover" element={<NotFound />} />
              <Route path="favorites" element={<NotFound />} />
              <Route path="playlists" element={<NotFound />} />
              <Route path="friends" element={<NotFound />} />
              <Route path="messages" element={<NotFound />} />
              <Route path="notifications" element={<NotFound />} />
              <Route path="search" element={<NotFound />} />

              {/* Catch-all dentro do layout */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Rotas públicas sem layout */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="register/:token" element={<Register />} />
            <Route path="spotify-callback" element={<SpotifyCallback />} />

            {/* Catch-all global */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

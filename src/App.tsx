import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SpotifyCallback from "./pages/SpotifyCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            {/* Placeholder routes for future implementation */}
            <Route path="/listening" element={<NotFound />} />
            <Route path="/discover" element={<NotFound />} />
            <Route path="/favorites" element={<NotFound />} />
            <Route path="/playlists" element={<NotFound />} />
            <Route path="/friends" element={<NotFound />} />
            <Route path="/search" element={<NotFound />} />
            <Route path="/create" element={<NotFound />} />
            <Route path="/menu" element={<NotFound />} />
          </Route>
          <Route path="/spotify-callback" element={<SpotifyCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
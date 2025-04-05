export interface SpotifyTrack {
    id: string;
    name: string;
    artists: {
      name: string;
    }[];
    album: {
      name: string;
      images: {
        url: string;
      }[];
    };
    external_urls: {
      spotify: string;
    };
  }
  
  export interface SpotifyPlaylist {
    tracks: {
      items: {
        track: SpotifyTrack;
      }[];
    };
  }
  
  export interface SpotifyData {
    tracks: SpotifyTrack[];
    playlists: SpotifyPlaylist[];
  }  
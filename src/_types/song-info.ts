export interface SongInfo {
  title: string;
  artist: string;
  views: number;
  uploadDate?: string;
  imageSrc?: string | null;
  image?: unknown;
  isPaused?: boolean;
  songDuration: number;
  elapsedSeconds?: number;
  url?: string;
  album?: string | null;
  videoId: string;
  playlistId?: string;
}

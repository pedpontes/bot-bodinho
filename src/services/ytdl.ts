export interface YtProtocols {
  validateURL(url: string): boolean;
  loadUrlDetails(url: string): Promise<{
    playlist_title: string;
    tracks: {
      id: string;
      title: string;
      url: string;
      duration: number;
      uploader: string;
    }[];
  }>;
}

export class YtdlHelper implements YtProtocols {
  ydtl: any;

  constructor() {
    this.ydtl = require('ytdl-core');
  }

  validateURL(url: string): boolean {
    return this.ydtl.validateURL(url);
  }

  async loadUrlDetails(url: string): Promise<{
    playlist_title: string;
    tracks: {
      id: string;
      title: string;
      url: string;
      duration: number;
      uploader: string;
    }[];
  }> {
    const response = await fetch(
      `http://localhost:3000/playlist?url=${encodeURIComponent(url)}`,
    );
    if (!response.ok) {
      throw new Error(
        `Erro ao buscar informações da playlist: ${response.statusText}`,
      );
    }

    return await response.json();
  }
}

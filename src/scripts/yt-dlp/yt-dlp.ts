(async () => {
  try {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const response = await fetch(
      `http://localhost:3000/video_info?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar informações do vídeo');
    }

    const data = await response.json();
    console.log('Informações do vídeo:', data);
  } catch (e) {
    console.error('Erro ao buscar informações do vídeo:', e);
  }
})();

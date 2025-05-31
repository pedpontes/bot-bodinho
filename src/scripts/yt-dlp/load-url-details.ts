require('module-alias/register');
import { YtdlHelper } from '@/services/ytdl';

(async () => {
  const loadUrlDetails = new YtdlHelper();

  try {
    const data = await loadUrlDetails.loadUrlDetails(
      'https://www.youtube.com/watch?v=DUGgCbgm8x4&list=RDDUGgCbgm8x4&start_radio=1',
    );

    console.log('Detalhes da música:', data);
  } catch (error) {
    console.error('Erro ao carregar detalhes da música:', error);
  }
})();

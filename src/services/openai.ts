import dev from '@/main/configs/config';
import OpenAi from 'openai';

export const openai = new OpenAi({
  apiKey: dev.openaiApiKey,
});

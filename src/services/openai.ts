import OpenAi from 'openai';
import dev from '../main/configs/config';

export const openai = new OpenAi({
  apiKey: dev.openaiApiKey,
});

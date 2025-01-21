import OpenAi from 'openai';
import dev from '../config';

export const openai = new OpenAi({
      apiKey: dev.openaiApiKey,
    });
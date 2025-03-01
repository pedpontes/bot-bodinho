import dev from '@/main/configs/config';
import OpenAi from 'openai';
import {
  CompletionCreateParamsNonStreaming,
  ImageGenerateParams,
} from 'openai/resources';

export const openai = new OpenAi({
  apiKey: dev.openaiApiKey,
});

export class OpenAiHelper {
  openai: OpenAi;

  constructor() {
    if (!dev.openaiApiKey) throw new Error('OpenAI API keyis missing');

    this.openai = new OpenAi({
      apiKey: dev.openaiApiKey,
    });
  }

  async createCompletion(data: CompletionCreateParamsNonStreaming) {
    const completion = await this.openai.completions.create(data);

    return completion.choices[0].text;
  }

  async createImage(data: ImageGenerateParams) {
    const image = await this.openai.images.generate(data);

    return image.data[0];
  }
}

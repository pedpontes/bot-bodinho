import { CreatorImage } from '@/domain/use-cases/open-ai/creator-image';
import { OpenAiUseCase } from '@/domain/use-cases/open-ai/open-ai';
import { Image, ImageGenerateParams } from 'openai/resources';

export class CreatorImageUseCase implements CreatorImage {
  constructor(
    private readonly openAiImage: OpenAiUseCase<ImageGenerateParams, Image>,
  ) {}

  async createImage(input: string): Promise<{ b64_json: string; url: string }> {
    const { url, b64_json } = await this.openAiImage.handle({
      model: 'dall-e-3',
      n: 1,
      prompt: input,
      quality: 'hd',
      style: 'vivid',
      size: '1024x1024',
      response_format: 'url',
    });

    return {
      b64_json: b64_json || '',
      url: url || '',
    };
  }
}

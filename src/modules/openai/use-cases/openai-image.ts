import { OpenAiHelper } from '@/services/openai';
import { Image, ImageGenerateParams } from 'openai/resources';
import { OpenAiUseCase } from './openai-completion';

export class OpenAiImage implements OpenAiUseCase<ImageGenerateParams, Image> {
  constructor(private readonly openAiHelper: OpenAiHelper) {}

  async handle(data: ImageGenerateParams): Promise<Image> {
    if (!data || !data.prompt)
      throw new Error('[OPENAI] ❌ O prompt é obrigatório.');

    const {
      model = 'dall-e-3',
      response_format = 'url',
      quality = 'hd',
      size = '1024x1024',
    } = data;

    try {
      const image = await this.openAiHelper.createImage({
        ...data,
        model,
        response_format,
        quality,
        size,
      });
      return image;
    } catch {
      throw new Error('[OPENAI] ❌ Erro ao completar a solicitação.');
    }
  }
}

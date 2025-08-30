import { OpenAiUseCase } from '@/domain/use-cases/open-ai/open-ai';
import { OpenAiHelper } from '@/services/openai';
import { Image, ImageGenerateParams } from 'openai/resources';

export class OpenAiImage implements OpenAiUseCase<ImageGenerateParams, Image> {
  constructor(private readonly openAiHelper: OpenAiHelper) {}

  async handle(data: ImageGenerateParams): Promise<Image> {
    if (!data || !data.prompt) throw new Error('❌ O prompt é obrigatório.');

    const {
      model = 'dall-e-3',
      response_format = 'url',
      quality = 'hd',
      size = '1024x1024',
    } = data;

    try {
      const { b64_json, url, revised_prompt } =
        await this.openAiHelper.createImage({
          ...data,
          model,
          response_format,
          quality,
          size,
        });
      return { b64_json, url, revised_prompt };
    } catch (error: any) {
      console.error('[OPENAI]', error);
      if (error.code == 'content_policy_violation')
        throw new Error(
          '❌ Erro ao completar a solicitação. O conteúdo viola a política.',
        );
      throw new Error('❌ Erro ao completar a solicitação.');
    }
  }
}

import { CreatorImageController } from '@/modules/bot/openai/controller/creator-image';
import { CreatorImageUseCase } from '@/modules/bot/openai/use-cases/create-image/creator-image/creator-image';
import { OpenAiImage } from '@/modules/bot/openai/use-cases/openai-image';
import { OpenAiHelper } from '@/services/openai';

export const makeCreatorImage = (): CreatorImageController => {
  return new CreatorImageController(
    new CreatorImageUseCase(new OpenAiImage(new OpenAiHelper())),
  );
};

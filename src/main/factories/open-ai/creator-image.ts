import { CreatorImageController } from '@/modules/openai/controller/creator-image';
import { CreatorImageUseCase } from '@/modules/openai/use-cases/create-image/creator-image/creator-image';
import { OpenAiImage } from '@/modules/openai/use-cases/openai-image';
import { OpenAiHelper } from '@/services/openai';

export const makeCreatorImage = (): CreatorImageController => {
  return new CreatorImageController(
    new CreatorImageUseCase(new OpenAiImage(new OpenAiHelper())),
  );
};

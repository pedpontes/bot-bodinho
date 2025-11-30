import {
  DiscordAuthModel,
  UpdateDiscordAuthModel,
} from '@/domain/interfaces/discord';
import { db } from '@/main/prisma';

export interface DiscordAuthRepository {
  update(
    id: DiscordAuthModel['id'],
    data: UpdateDiscordAuthModel,
  ): Promise<DiscordAuthModel>;
}

export class DiscordAuthPrismaRepository implements DiscordAuthRepository {
  async update(
    id: DiscordAuthModel['id'],
    data: UpdateDiscordAuthModel,
  ): Promise<DiscordAuthModel> {
    return await db.discordAuth.update({
      where: { id },
      data,
    });
  }
}

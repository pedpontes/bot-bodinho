import { AddDiscordAuthModel } from '@/domain/interfaces/discord';
import {
  AddUserModel,
  UpdateUserModel,
  UserModel,
  UserWithDiscordAuthModel,
} from '@/domain/interfaces/user';
import { db } from '@/main/prisma';

export interface UserRepository {
  add(user: AddUserModel, discordData: AddDiscordAuthModel): Promise<UserModel>;
  loadById(id: string): Promise<UserModel | undefined>;
  loadByDiscordId(discordId: string): Promise<UserModel | null>;
  loadAll(): Promise<UserModel[]>;
  update(id: string, user: Partial<UserModel>): Promise<UserModel>;
  delete(id: string): Promise<void>;
}

export class UserPrismaRepository implements UserRepository {
  async add(
    user: AddUserModel,
    discordData: AddDiscordAuthModel,
  ): Promise<UserModel> {
    const created = await db.user.create({
      data: {
        email: user.email,
        username: user.username,
        avatar: user.avatar ?? undefined,
        discordAuth: {
          create: discordData,
        },
      },
    });

    return created;
  }

  async loadById(id: string): Promise<UserModel | undefined> {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) return undefined;

    return user;
  }

  async loadByDiscordId(
    discordId: string,
  ): Promise<UserWithDiscordAuthModel | null> {
    const user = await db.user.findFirst({
      where: {
        discordAuth: {
          discordId: discordId,
        },
      },
      include: {
        discordAuth: true,
      },
    });

    if (!user) return null;

    return user;
  }

  async loadAll(): Promise<UserModel[]> {
    const allUsers = await db.user.findMany();
    return allUsers;
  }

  async update(id: UserModel['id'], data: UpdateUserModel): Promise<UserModel> {
    const updated = await db.user.update({
      where: { id },
      data,
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.user.delete({
      where: { id },
    });
  }
}

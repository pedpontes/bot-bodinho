import {
  AddUserModel,
  UpdateUserModel,
  UserModel,
} from '@/domain/interfaces/user';
import { db } from '@/main/prisma';

export interface UserRepository {
  add(user: AddUserModel): Promise<UserModel>;
  loadById(id: string): Promise<UserModel | undefined>;
  loadByDiscordId(discordId: string): Promise<UserModel | undefined>;
  loadAll(): Promise<UserModel[]>;
  update(id: string, user: Partial<UserModel>): Promise<UserModel>;
  delete(id: string): Promise<void>;
}

export class PrismaUserRepository implements UserRepository {
  async add(user: AddUserModel): Promise<UserModel> {
    const created = await db.user.create({
      data: {
        email: user.email ?? undefined,
        username: user.username,
        discordId: user.discordId,
        avatar: user.avatar ?? undefined,
        provider: user.provider ?? 'platform',
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

  async loadByDiscordId(discordId: string): Promise<UserModel | undefined> {
    const user = await db.user.findUnique({
      where: { discordId },
    });

    if (!user) return undefined;

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

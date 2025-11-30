import { PrismaClient } from '@prisma/client';

const prismaHelper = new PrismaClient();

export const db = prismaHelper;

import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { upload } from '@/main/adapters/file-adapter';
import { makeAddUploadController } from '@/main/factories/uploads/add-upload';
import { makeDeleteUploadController } from '@/main/factories/uploads/delete-upload';
import { makeLoadUploadsPaginationController } from '@/main/factories/uploads/load-uploads-pagination';
import { makePlayUploadController } from '@/main/factories/uploads/play-upload';
import { ensureAuthenticateUser } from '@/main/middlewares/ensureAuthenticateUser';
import { Router } from 'express';

const uploadsRouter = Router();

uploadsRouter.post(
  '/',
  ensureAuthenticateUser,
  upload.single('audio'),
  adaptRoute(makeAddUploadController()),
);

uploadsRouter.get(
  '/',
  ensureAuthenticateUser,
  adaptRoute(makeLoadUploadsPaginationController()),
);

uploadsRouter.delete(
  '/:id',
  ensureAuthenticateUser,
  adaptRoute(makeDeleteUploadController()),
);

uploadsRouter.post(
  '/:id/play',
  ensureAuthenticateUser,
  adaptRoute(makePlayUploadController()),
);

export { uploadsRouter };

import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { upload } from '@/main/adapters/file-adapter';
import { makeAddUploadController } from '@/main/factories/uploads/add-upload';
import { makeDeleteUploadController } from '@/main/factories/uploads/delete-upload';
import { makeLoadUploadsPaginationController } from '@/main/factories/uploads/load-uploads-pagination';
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

export { uploadsRouter };

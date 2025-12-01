import multer from 'multer';

export const upload = multer({
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  storage: multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, 'temp/');
    },
    filename: (_, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

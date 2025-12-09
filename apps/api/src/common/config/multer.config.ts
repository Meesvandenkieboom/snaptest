import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueSuffix);
    },
  }),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('video/')) {
      return callback(new Error('Only video files are allowed'), false);
    }
    callback(null, true);
  },
};

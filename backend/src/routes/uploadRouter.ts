import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController';
import { isAuth } from '../utils';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), uploadFile);

export default uploadRouter;

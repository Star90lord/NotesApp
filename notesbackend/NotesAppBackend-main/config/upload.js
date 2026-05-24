import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";
import { ensureUploadsDirectory } from "../utils/fileStorage.js";
import { uploadsDirectory } from "./paths.js";

const storage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    try {
      await ensureUploadsDirectory();
      callback(null, uploadsDirectory);
    } catch (error) {
      callback(error);
    }
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 10,
  },
});

export default upload;

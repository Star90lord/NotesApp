import fs from "fs/promises";
import path from "path";
import { uploadsDirectory } from "../config/paths.js";

export const ensureUploadsDirectory = async () => {
  await fs.mkdir(uploadsDirectory, { recursive: true });
};

const getStoragePath = (storageName) => path.join(uploadsDirectory, storageName);

export const deleteStoredFile = async (storageName) => {
  if (!storageName) {
    return;
  }

  try {
    await fs.unlink(getStoragePath(storageName));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

export const deleteStoredFiles = async (attachments = []) => {
  await Promise.all(
    attachments.map((attachment) => deleteStoredFile(attachment.storageName)),
  );
};

import express from "express";
import upload from "../config/upload.js";
import { uploadAttachments } from "../Controllers/upload.controller.js";

const router = express.Router();

router.post(["", "/"], upload.array("attachments", 10), uploadAttachments);

export default router;

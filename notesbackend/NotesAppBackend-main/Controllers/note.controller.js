import mongoose from "mongoose";
import Note from "../models/note.models.js";
import { deleteStoredFiles } from "../utils/fileStorage.js";

const ALLOWED_COLORS = new Set([
  "slate",
  "rose",
  "amber",
  "emerald",
  "sky",
  "violet",
  "stone",
]);

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeTags = (tags) => {
  if (typeof tags === "string") {
    return [...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))];
  }

  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(tags.map((tag) => normalizeText(tag)).filter(Boolean))];
};

const normalizeAttachments = (attachments) => {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments
    .slice(0, 10)
    .map((attachment) => ({
      name: normalizeText(attachment?.name),
      type: normalizeText(attachment?.type) || "application/octet-stream",
      size: Number(attachment?.size) || 0,
      storageName: normalizeText(attachment?.storageName),
      url: typeof attachment?.url === "string" ? attachment.url : "",
    }))
    .filter(
      (attachment) =>
        attachment.name &&
        attachment.storageName &&
        attachment.url &&
        attachment.size > 0 &&
        attachment.size <= 25 * 1024 * 1024,
    );
};

const getCreatePayload = (body = {}) => {
  const title = normalizeText(body.title);
  const content = normalizeText(body.content);

  if (!title || !content) {
    return null;
  }

  const color = ALLOWED_COLORS.has(body.color) ? body.color : "slate";

  return {
    title,
    content,
    tags: normalizeTags(body.tags),
    color,
    isFavorite: Boolean(body.isFavorite),
    attachments: normalizeAttachments(body.attachments),
  };
};

const getUpdatePayload = (body = {}) => {
  const payload = {};

  if ("title" in body) {
    const title = normalizeText(body.title);

    if (!title) {
      return null;
    }

    payload.title = title;
  }

  if ("content" in body) {
    const content = normalizeText(body.content);

    if (!content) {
      return null;
    }

    payload.content = content;
  }

  if ("tags" in body) {
    payload.tags = normalizeTags(body.tags);
  }

  if ("color" in body) {
    payload.color = ALLOWED_COLORS.has(body.color) ? body.color : "slate";
  }

  if ("isFavorite" in body) {
    payload.isFavorite = Boolean(body.isFavorite);
  }

  if ("attachments" in body) {
    payload.attachments = normalizeAttachments(body.attachments);
  }

  if (Object.keys(payload).length === 0) {
    return null;
  }

  return payload;
};

const isInvalidNoteId = (id) => !mongoose.isValidObjectId(id);

export const createNote = async (req, res, next) => {
  try {
    const payload = getCreatePayload(req.body);

    if (!payload) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const note = await Note.create(payload);

    return res.status(201).json({
      message: "Note created successfully.",
      note,
    });
  } catch (error) {
    return next(error);
  }
};

export const getNotes = async (_req, res, next) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });

    return res.status(200).json({ notes });
  } catch (error) {
    return next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = getUpdatePayload(req.body);

    if (isInvalidNoteId(id)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    if (!payload) {
      return res.status(400).json({
        message: "Please provide valid note fields to update.",
      });
    }

    const existingNote = await Note.findById(id);

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    const updatedNote = await Note.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (payload.attachments) {
      const currentStorageNames = new Set(
        payload.attachments.map((attachment) => attachment.storageName),
      );
      const removedAttachments = existingNote.attachments.filter(
        (attachment) => !currentStorageNames.has(attachment.storageName),
      );

      await deleteStoredFiles(removedAttachments);
    }

    return res.status(200).json({
      message: "Note updated successfully.",
      note: updatedNote,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidNoteId(id)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    await deleteStoredFiles(deletedNote.attachments);

    return res.status(200).json({
      message: "Note deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

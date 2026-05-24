import express from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../Controllers/note.controller.js";

const router = express.Router();

router.route("/").get(getNotes).post(createNote);
router.route("/:id").put(updateNote).delete(deleteNote);

export default router;

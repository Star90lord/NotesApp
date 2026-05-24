import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notecontext } from "../context/noteContext";
import NoteEditor from "./NoteEditor";
import { getEmptyNoteDraft } from "../utils/noteHelpers";

function Noteform() {
  const navigate = useNavigate();
  const { createNote } = useContext(Notecontext);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNote = async (payload) => {
    setIsSaving(true);

    try {
      await createNote(payload);
      navigate("/");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create note.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-panel w-full rounded-[2rem] p-5 sm:p-8">
      <NoteEditor
        initialValue={getEmptyNoteDraft()}
        onSubmit={handleCreateNote}
        submitLabel="Create note"
        busyLabel="Saving note..."
        isSaving={isSaving}
        heading="Build a richer note"
        description="Create markdown notes, tag them, attach files, mark favorites, and organize them by color so your internship project feels like a complete product."
      />
    </div>
  );
}

export default Noteform;

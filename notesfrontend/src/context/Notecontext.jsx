import { useEffect, useState } from "react";
import apiClient from "../api/Url";
import { Notecontext } from "./noteContext";

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getNotes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/");
      setNotes(response.data.notes);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const createNote = async (note) => {
    const response = await apiClient.post("/", note);
    setNotes((currentNotes) => [response.data.note, ...currentNotes]);
  };

  const updateNote = async (id, updatedFields) => {
    const response = await apiClient.put(`/${id}`, updatedFields);
    setNotes((currentNotes) =>
      currentNotes.map((note) => (note._id === id ? response.data.note : note)),
    );
  };

  const deleteNote = async (id) => {
    await apiClient.delete(`/${id}`);
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note._id !== id),
    );
  };

  return (
    <Notecontext.Provider
      value={{
        notes,
        loading,
        error,
        getNotes,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </Notecontext.Provider>
  );
};

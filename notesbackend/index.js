import("./NotesAppBackend-main/index.js").catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});

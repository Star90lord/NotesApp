const Fotter = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-5 text-[var(--text-muted)]">
      <div className="container mx-auto px-4 text-center text-sm sm:px-6">
        {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[var(--accent)]">NoteKeeper</span>.
        Responsive notes workspace for internship demos and portfolio projects.
      </div>
    </footer>
  );
};

export default Fotter;

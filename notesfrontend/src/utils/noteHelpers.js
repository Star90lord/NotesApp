export const NOTE_COLORS = [
  { value: "slate", label: "Slate", accent: "bg-slate-500", ring: "ring-slate-400/40" },
  { value: "rose", label: "Rose", accent: "bg-rose-500", ring: "ring-rose-400/40" },
  { value: "amber", label: "Amber", accent: "bg-amber-500", ring: "ring-amber-400/40" },
  { value: "emerald", label: "Emerald", accent: "bg-emerald-500", ring: "ring-emerald-400/40" },
  { value: "sky", label: "Sky", accent: "bg-sky-500", ring: "ring-sky-400/40" },
  { value: "violet", label: "Violet", accent: "bg-violet-500", ring: "ring-violet-400/40" },
  { value: "stone", label: "Stone", accent: "bg-stone-500", ring: "ring-stone-400/40" },
];

export const getEmptyNoteDraft = () => ({
  title: "",
  content: "",
  tags: [],
  color: "slate",
  isFavorite: false,
  attachments: [],
});

export const noteToDraft = (note = {}) => ({
  title: note.title || "",
  content: note.content || "",
  tags: Array.isArray(note.tags) ? note.tags : [],
  color: note.color || "slate",
  isFavorite: Boolean(note.isFavorite),
  attachments: Array.isArray(note.attachments) ? note.attachments : [],
});

export const getColorClasses = (color) => {
  const colorMap = {
    slate: "border-slate-500/30 from-slate-500/10 to-transparent",
    rose: "border-rose-500/30 from-rose-500/10 to-transparent",
    amber: "border-amber-500/30 from-amber-500/10 to-transparent",
    emerald: "border-emerald-500/30 from-emerald-500/10 to-transparent",
    sky: "border-sky-500/30 from-sky-500/10 to-transparent",
    violet: "border-violet-500/30 from-violet-500/10 to-transparent",
    stone: "border-stone-500/30 from-stone-500/10 to-transparent",
  };

  return colorMap[color] || colorMap.slate;
};

export const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

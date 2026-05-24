const buildAttachmentFromFile = (file, req) => ({
  name: file.originalname,
  type: file.mimetype || "application/octet-stream",
  size: file.size,
  storageName: file.filename,
  url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
});

export const uploadAttachments = async (req, res, next) => {
  try {
    const attachments = (req.files || []).map((file) =>
      buildAttachmentFromFile(file, req),
    );

    return res.status(201).json({
      message: "Files uploaded successfully.",
      attachments,
    });
  } catch (error) {
    return next(error);
  }
};

import multer from "multer";

// image start
const imageStorage = multer.diskStorage({
  destination: function (_, file, cb) {
    cb(null, "public/image_tem");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now());
  },
});

const imageFilter = function (_, file, cb) {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image allowed"));
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// video starts

const videoStorage = multer.diskStorage({
  destination: function (_, file, cb) {
    cb(null, "public/video_tem");
  },
  filename: function (_, file, cb) {
    cb(null, file.fieldname + Date.now());
  },
});

const videoFilter = function (_, file, cb) {
  if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/"))
    cb(null, true);
  else cb(new Error("Only video or Thumbnail allowed"));
};

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export { uploadImage, videoUpload };

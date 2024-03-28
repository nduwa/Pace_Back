import multer, { memoryStorage, diskStorage } from "multer";
import { v4 } from "uuid";

export const memoryUpload = multer({ storage: memoryStorage() });

// Configure Multer storage (optional, adjust as needed)
export const upload = multer({
  storage: diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Temporary storage location (optional)
    },
    filename: function (req, file, cb) {
      cb(null, v4() + file.originalname.split(".").pop()); // Unique filename
    },
  }),
});

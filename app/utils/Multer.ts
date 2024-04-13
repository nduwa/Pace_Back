import multer, { memoryStorage, StorageEngine } from "multer";
import { v4 } from "uuid";
import path from "path";
import fs from "fs";

export const memoryUpload = multer({ storage: memoryStorage() });

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../assets/uploads");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, v4() + file.originalname.split(".").pop()); // Unique filename
  },
});

// Configure Multer storage (optional, adjust as needed)
export const upload = multer({
  storage: storage,
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only .xlsx and .xls are allowed"), false);
  }
};

export const uploadExcel = multer({
  storage: storage,
  fileFilter: fileFilter,
});

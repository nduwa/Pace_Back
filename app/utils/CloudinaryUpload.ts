import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { Request } from "express";
import { v4 } from "uuid";
import VARIABLES from "../config/variables";

cloudinary.config({
  api_key: VARIABLES.CLOUDINARY_API_KEY,
  api_secret: VARIABLES.CLOUDINARY_API_SECRET,
  cloud_name: VARIABLES.CLOUD_NAME,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req: Request, file: Express.Multer.File) => ({
    public_id: v4(),
    folder: "paccy-med",
  }),
});
const CloudinaryUpload = multer({ storage: storage });
export default CloudinaryUpload;

export { cloudinary };

import multer from "multer";
import path from "path";
import fs from "fs";
import { generarId } from "../helpers/tokens.js";

const uploadPath = './public/uploads';

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        cb(null, generarId() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export default upload;
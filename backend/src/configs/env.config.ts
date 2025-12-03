import "dotenv/config";

const PORT = process.env.PORT;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS;
const BASE_WEB_API = process.env.BASE_WEB_URL;
const SECRET_KEY = process.env.SECRET_KEY || '';
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "";
const SECRET_REFRESH_KEY = process.env.SECRET_REFRESH_KEY || "";

export {
    PORT,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME,
    GMAIL_APP_PASS,
    GMAIL_EMAIL,
    BASE_WEB_API,
    SECRET_KEY,
    SECRET_ACCESS_KEY,
    SECRET_REFRESH_KEY
}
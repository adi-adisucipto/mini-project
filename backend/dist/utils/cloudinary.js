"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUplaod = cloudinaryUplaod;
exports.cloudinaryRemove = cloudinaryRemove;
const cloudinary_1 = require("cloudinary");
const env_config_1 = require("../configs/env.config");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    api_key: env_config_1.CLOUDINARY_API_KEY,
    api_secret: env_config_1.CLOUDINARY_API_SECRET,
    cloud_name: env_config_1.CLOUDINARY_CLOUD_NAME,
});
function bufferToStream(buffer) {
    return stream_1.Readable.from(buffer);
}
function cloudinaryUplaod(file, folder) {
    return new Promise((resolve, reject) => {
        const stream = bufferToStream(file.buffer);
        const upload = cloudinary_1.v2.uploader.upload_stream({ folder }, (err, result) => {
            if (err)
                return reject(err);
            if (!result)
                return reject("No result");
            resolve(result);
        });
        stream.pipe(upload);
    });
}
async function cloudinaryRemove(avatar_id) {
    return await cloudinary_1.v2.uploader.destroy(avatar_id);
}

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../configs/env.config";
import { Readable } from "stream";

cloudinary.config({
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    cloud_name: CLOUDINARY_CLOUD_NAME,
});

function bufferToStream (buffer : Buffer) : Readable {
    return Readable.from(buffer);
}

export function cloudinaryUplaod(file: Express.Multer.File, folder?: string) : Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const stream = bufferToStream(file.buffer);
        const upload = cloudinary.uploader.upload_stream({folder}, (err, result) => {
            if(err) return reject(err);
            if(!result) return reject("No result");
            resolve(result);
        });
        stream.pipe(upload);
    });
}

export async function cloudinaryRemove(avatar_id: string) {
    return await cloudinary.uploader.destroy(avatar_id);
}
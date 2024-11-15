"use server"
// utils/google-cloud-storage.ts
import { Storage } from '@google-cloud/storage';
import {NextResponse} from "next/server";


const storage = new Storage({
    projectId: 'thecloud2',
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    },
});

export const uploadToGoogleCloudStorage = async (formData: FormData, file: File) => {
    const bucketName = "tiktok_csv_upload_new"//process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
    if (!bucketName) {
        throw new Error('Google Cloud Storage bucket name is not defined');
    }

    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(file.name);

    console.log(`Attempting to upload file: ${file.name}`);

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        return new Promise((resolve, reject) => {
            const blobStream = blob.createWriteStream({
                resumable: false,
                gzip: true,
            });

            blobStream.on('error', (err) => {
                console.error('Stream error:', err);
                reject(new Error(`File upload failed: ${err.message}`));
            });

            blobStream.on('finish', () => {
                console.log(`File ${file.name} uploaded successfully.`);
                resolve({
                    message: 'File uploaded successfully',
                    fileName: file.name,
                    fileSize: file.size,
                });
            });

            blobStream.end(buffer);
        });
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// export { uploadToGoogleCloudStorage };
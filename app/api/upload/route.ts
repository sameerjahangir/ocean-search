import { NextResponse } from 'next/server';
import {uploadToGoogleCloudStorage} from "@/utils/google-cloud-storage";

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    try {
        // Execute the upload function and wait for completion
        await uploadToGoogleCloudStorage(formData, file);
        // If the upload is successful, send a success response
        return new Response(JSON.stringify({ message: 'File uploaded successfully' }), { status: 200 });
    } catch (error) {
        // If there's an error, catch it and return an error response
        console.error('Upload failed:', error);
        return new Response(JSON.stringify({ error: 'File upload failed' }), { status: 500 });
    }
}
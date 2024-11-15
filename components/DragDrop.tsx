import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { OpenAI } from "openai";
import Papa from 'papaparse';
import { useEffect } from 'react';
import {toast} from "@/components/ui/use-toast";



// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true });

const DragDrop: React.FC = () => {
    const [rowCount, setRowCount] = useState(0);
    const [uploadedData, setUploadedData] = useState<[]>([]);

    useEffect(() => {
        console.log('Updated uploaded data:', uploadedData);
        setRowCount(uploadedData.length);
    }, [uploadedData]);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        const reader = new FileReader();

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        reader.onload = async (e) => {
            const contents = e.target?.result as string;
            Papa.parse(contents, {
                header: true,
                complete: (results) => {
                    setUploadedData(results.data);

                    toast({
                        title: "Success",
                        description: "All prospects have been uploaded successfully.",
                        variant: "success",
                    });

                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                }
            });
        };

        reader.readAsText(file);
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-md mx-auto">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed p-4 rounded-md ${
                        isDragActive ? 'border-blue-500' : 'border-gray-300'
                    }`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="text-center">Drop the CSV file here...</p>
                    ) : (
                        <p className="text-center">
                            Drag and drop a CSV file here, or click to select a file
                        </p>
                    )}
                </div>

                {rowCount > 0 && (
                    <p className="mt-4 text-center">
                        {rowCount} row{rowCount === 1 ? '' : 's'} uploaded
                    </p>
                )}

            </Card>
        </div>
    );
};

export default DragDrop;
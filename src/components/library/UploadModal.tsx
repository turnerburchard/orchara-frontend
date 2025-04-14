import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { useUpload } from '../../hooks/useUpload';
import { BlackButton } from '../ui/buttons';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    userId?: string;
}

const UploadModal: FC<UploadModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
    const [files, setFiles] = useState<File[]>([]);
    const { uploadFiles, loading, error, success, paper, missingDoi, resetState } = useUpload(userId);

    const handleClose = () => {
        if (success && onSuccess) {
            onSuccess();
        }
        resetState();
        setFiles([]);
        onClose();
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
        setFiles(prev => [...prev, ...droppedFiles]);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []).filter(file => file.type === 'application/pdf');
        setFiles(prev => [...prev, ...selectedFiles]);
    }, []);

    const handleUpload = async () => {
        if (files.length === 0) return;
        
        try {
            await uploadFiles(files);
            if (success && onSuccess) {
                onSuccess();
                handleClose();
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Upload Papers</h2>
                
                {success ? (
                    <div className="text-center py-8">
                        <div className="text-green-500 mb-4">
                            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Upload Successful!
                        </h3>
                        {missingDoi && (
                            <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-4">
                                Note: No DOI was found in the paper.
                            </p>
                        )}
                        <BlackButton onClick={handleClose}>
                            Close
                        </BlackButton>
                    </div>
                ) : (
                    <>
                        <div 
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-4 text-center"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                Drag and drop PDF files here, or
                            </p>
                            <label className="cursor-pointer">
                                <span className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                                    browse
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    multiple
                                    onChange={handleFileSelect}
                                />
                            </label>
                        </div>

                        {files.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Files:</h3>
                                <ul className="space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                Cancel
                            </button>
                            <BlackButton
                                onClick={handleUpload}
                                disabled={files.length === 0 || loading}
                            >
                                {loading ? 'Uploading...' : 'Upload'}
                            </BlackButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadModal; 
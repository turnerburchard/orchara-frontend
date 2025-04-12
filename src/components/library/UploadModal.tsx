import type { FC, ChangeEvent, DragEvent } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { BlackButton } from '../ui/buttons';
import { useState, useRef, useEffect } from 'react';
import { useUpload } from '../../hooks/useUpload';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

const UploadModal: FC<UploadModalProps> = ({ isOpen, onClose, userId }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFiles, loading, error, success, paper, missingDoi, resetState } = useUpload(userId);

    // Reset state when modal is opened
    useEffect(() => {
        if (isOpen) {
            resetState();
        }
    }, [isOpen, resetState]);

    // Close modal on successful upload
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setFiles([]);
                onClose();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, onClose]);

    if (!isOpen) return null;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        const success = await uploadFiles(files);
        if (success) {
            // Success is handled by the useEffect
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upload Papers</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div 
                    className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg p-8 text-center transition-colors`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop your PDF papers here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        multiple 
                        accept=".pdf"
                    />
                    <BlackButton className="mt-4" onClick={handleBrowseClick}>
                        Browse files
                    </BlackButton>
                </div>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                        {paper ? (
                            <div>
                                <p className="font-medium">Paper uploaded successfully!</p>
                                <p className="text-sm mt-1">Title: {paper.title}</p>
                                {missingDoi && (
                                    <p className="text-sm mt-1 text-amber-600">
                                        Note: DOI was not found in the paper.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p>File uploaded successfully!</p>
                        )}
                    </div>
                )}
                
                {files.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Selected Files:</h3>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                                    <button 
                                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <BlackButton onClick={handleUpload} disabled={loading}>
                                {loading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'}`}
                            </BlackButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadModal; 
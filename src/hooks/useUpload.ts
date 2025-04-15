import { useState } from 'react';
import config from '../config';
import type { Paper } from '../types/library';

interface UploadState {
    loading: boolean;
    error: string | null;
    success: boolean;
    paper: Paper | null;
}

export const useUpload = (userId: string = 'user0') => {
    const [state, setState] = useState<UploadState>({
        loading: false,
        error: null,
        success: false,
        paper: null,
    });

    const uploadFile = async (file: File) => {
        if (!file) {
            setState(prev => ({ ...prev, error: 'No file selected' }));
            return false;
        }

        // Validate file is a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            setState(prev => ({ ...prev, error: 'Only PDF files are allowed' }));
            return false;
        }

        setState({ loading: true, error: null, success: false, paper: null});

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', userId);

            const response = await fetch(`${config.apiUrl}/api/upload-pdf`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Invalid file format. Only PDF files are allowed.');
                }
                
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to upload file');
            }

            const data = await response.json();
            
            // Ensure the paper data matches our Paper interface
            const paper: Paper = {
                id: data.paper.paper_id,
                paper_id: data.paper.paper_id,
                title: data.paper.title,
                authors: [], // Backend doesn't return authors yet
                abstract: data.paper.abstract || '',
                doi: undefined, // Backend doesn't return DOI yet
                publication_date: undefined, // Backend doesn't return publication date yet
                file_path: data.paper.url,
                created_at: new Date().toISOString(), // Backend doesn't return timestamps yet
                updated_at: new Date().toISOString() // Backend doesn't return timestamps yet
            };
            
            setState({ 
                loading: false, 
                error: null, 
                success: data.success, 
                paper,
            });
            
            return data.success;
        } catch (error) {
            console.error('Upload error:', error);
            setState({ 
                loading: false, 
                error: 'Upload failed. Please try again.', 
                success: false,
                paper: null,
            });
            return false;
        }
    };

    const uploadFiles = async (files: File[]) => {
        if (!files.length) {
            setState(prev => ({ ...prev, error: 'No files selected' }));
            return false;
        }

        // For now, we'll just upload the first file since the API only supports one file at a time
        return uploadFile(files[0]);
    };

    const resetState = () => {
        setState({ 
            loading: false, 
            error: null, 
            success: false,
            paper: null,
        });
    };

    return {
        ...state,
        uploadFile,
        uploadFiles,
        resetState
    };
}; 
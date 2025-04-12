import { useState } from 'react';
import config from '../config';
import type { Paper } from '../types/library';

interface UploadState {
    loading: boolean;
    error: string | null;
    success: boolean;
    paper: Paper | null;
    missingDoi: boolean;
}

export const useUpload = (userId: string = 'user0') => {
    const [state, setState] = useState<UploadState>({
        loading: false,
        error: null,
        success: false,
        paper: null,
        missingDoi: false
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

        setState({ loading: true, error: null, success: false, paper: null, missingDoi: false });

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
                id: data.paper.id,
                paper_id: data.paper.paper_id || data.paper.id,
                title: data.paper.title,
                authors: data.paper.authors || [],
                abstract: data.paper.abstract,
                doi: data.paper.doi,
                publication_date: data.paper.publication_date,
                file_path: data.paper.file_path,
                created_at: data.paper.created_at,
                updated_at: data.paper.updated_at
            };
            
            setState({ 
                loading: false, 
                error: null, 
                success: data.success, 
                paper,
                missingDoi: data.missing_doi || false
            });
            
            return data.success;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setState({ 
                loading: false, 
                error: errorMessage, 
                success: false,
                paper: null,
                missingDoi: false
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
            missingDoi: false
        });
    };

    return {
        ...state,
        uploadFile,
        uploadFiles,
        resetState
    };
}; 
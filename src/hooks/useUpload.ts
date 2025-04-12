import { useState } from 'react';
import config from '../config';

interface UploadState {
    loading: boolean;
    error: string | null;
    success: boolean;
    paper: any | null;
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

            const response = await fetch(`${config.apiUrl}/upload-pdf`, {
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
            
            setState({ 
                loading: false, 
                error: null, 
                success: data.success, 
                paper: data.paper || null,
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
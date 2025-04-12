import { useState, useEffect } from 'react';
import config from '../config';
import type { Paper, UserPapersResponse } from '../types/library';

interface UserPapersState {
    papers: Paper[];
    loading: boolean;
    error: string | null;
}

export const useUserPapers = (userId: string = 'user0') => {
    const [state, setState] = useState<UserPapersState>({
        papers: [],
        loading: true,
        error: null
    });

    const fetchPapers = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch(`${config.apiUrl}/api/user-papers?user_id=${userId}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch papers');
            }

            const data = await response.json() as UserPapersResponse;
            
            // Ensure we have an array of papers
            const papers = Array.isArray(data.papers) ? data.papers : [];
            
            setState({
                papers,
                loading: false,
                error: null
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setState({
                papers: [],
                loading: false,
                error: errorMessage
            });
        }
    };

    useEffect(() => {
        fetchPapers();
    }, [userId]);

    const refreshPapers = async () => {
        await fetchPapers();
    };

    const deletePaper = async (paperId: string): Promise<boolean> => {
        try {
            const response = await fetch(`${config.apiUrl}/api/user-papers/${paperId}?user_id=${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete paper');
            }

            // Refresh the papers list after successful deletion
            await refreshPapers();
            return true;
        } catch (error) {
            console.error('Error deleting paper:', error);
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to delete paper'
            }));
            return false;
        }
    };

    return {
        ...state,
        refreshPapers,
        deletePaper
    };
}; 
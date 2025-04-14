import { useState, useEffect } from 'react';
import config from '../config';
import type { Paper } from '../types/library';

interface UserPapersState {
    papers: Paper[];
    loading: boolean;
    error: string | null;
}

// Backend paper structure
interface BackendPaper {
    paper_id: string;
    title: string;
    abstract: string;
    authors: string;
    full_text: string;
    url: string;
    upload_date: string;
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

            const data = await response.json();
            
            // Transform the backend response to match our Paper interface
            const papers = Array.isArray(data.papers) ? data.papers.map((paper: BackendPaper) => ({
                id: paper.paper_id,
                paper_id: paper.paper_id,
                title: paper.title,
                authors: paper.authors ? paper.authors.split(',').map(author => author.trim()) : [],
                abstract: paper.abstract || '',
                doi: undefined, // Backend doesn't return DOI yet
                publication_date: undefined, // Backend doesn't return publication date yet
                file_path: paper.url,
                created_at: paper.upload_date || new Date().toISOString(),
                updated_at: paper.upload_date || new Date().toISOString()
            })) : [];
            
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
import { useState } from 'react';
import type { Paper } from '../types/paper';
import config from '../config';
import { sampleResponse } from '../mockData/sampleResponse';

const searchPapers = async (query: string, clusterSize: number): Promise<Paper[]> => {
    try {
        const response = await fetch(`${config.apiUrl}/api/search`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                query,
                cluster_size: clusterSize 
            })
        });
        
        const responseText = await response.text();
        if (!responseText) {
            throw new Error('Empty response from server');
        }

        const data = JSON.parse(responseText);
        if (!response.ok) {
            throw new Error(data.error || 'Search failed.');
        } else if (!data.results) {
            throw new Error('Invalid response format: missing results');
        }

        return data.results;
    } catch (err) {
        // Use sample data for any connection errors or when API is unavailable
        if (err instanceof Error && (
            err.message.includes('Failed to fetch') || 
            err.message.includes('Connection refused') ||
            err.message.includes('NetworkError') ||
            !config.apiUrl
        )) {
            return sampleResponse.papers.map(paper => ({
                paper_id: String(paper.paper_id),
                title: paper.title,
                abstract: paper.abstract,
                url: paper.url
            }));
        }
        return [];
    }
};

export const useSearch = (initialClusterSize: number = 5) => {
    const [query, setQuery] = useState<string>('');
    const [clusterSize] = useState<number>(initialClusterSize);
    const [results, setResults] = useState<Paper[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSelectedPaper(null);
        setLoading(true);
        
        try {
            const newResults = await searchPapers(query, clusterSize);
            // Only update results if they're different
            if (JSON.stringify(newResults) !== JSON.stringify(results)) {
                setResults(newResults);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        query,
        setQuery,
        results,
        loading,
        selectedPaper,
        setSelectedPaper,
        handleSearch
    };
}; 
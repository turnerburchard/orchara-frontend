import { useState } from 'react';
import type { Paper } from '../types';
import { searchPapers } from '../services/api';

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
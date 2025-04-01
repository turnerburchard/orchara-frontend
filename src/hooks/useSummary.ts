import { useState, useEffect, useRef } from 'react';
import config from '../config';
import { sampleResponse } from '../mockData/sampleResponse';
import type { Paper } from '../types';

interface Citation {
    id: number;
    paper_id: string;
    title: string;
    url: string;
    context: string;
}

interface SummaryResponse {
    summary: string;
    citations: Citation[];
}

interface SummaryState {
    data: SummaryResponse | null;
    loading: boolean;
    error: string | null;
}

const validateSummaryResponse = (data: any): data is SummaryResponse => {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.summary === 'string' &&
        Array.isArray(data.citations) &&
        data.citations.every((citation: any) =>
            typeof citation === 'object' &&
            citation !== null &&
            typeof citation.id === 'number' &&
            typeof citation.paper_id === 'string' &&
            typeof citation.title === 'string' &&
            typeof citation.url === 'string' &&
            typeof citation.context === 'string'
        )
    );
};

const isSampleData = (papers: Paper[]) => {
    if (!papers?.length) return false;
    return papers.length === sampleResponse.papers.length &&
        papers.every((paper, index) => 
            paper.paper_id === sampleResponse.papers[index].paper_id &&
            paper.title === sampleResponse.papers[index].title
        );
};

export const useSummary = (results: Paper[], query: string) => {
    const [state, setState] = useState<SummaryState>({
        data: null,
        loading: false,
        error: null
    });
    const isMounted = useRef(true);
    const lastRequestRef = useRef<{ results: Paper[], query: string } | null>(null);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (!isMounted.current) return;

        // Handle sample data or no results
        if (isSampleData(results)) {
            setState({ data: sampleResponse.summary, loading: false, error: null });
            return;
        }

        if (!results?.length) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        // Check if we've already requested these results
        const currentRequest = { results, query };
        if (lastRequestRef.current && 
            JSON.stringify(lastRequestRef.current) === JSON.stringify(currentRequest)) {
            return;
        }

        // Fetch from API
        setState(prev => ({ ...prev, loading: true, error: null, data: null }));
        lastRequestRef.current = currentRequest;

        const fetchSummary = async () => {
            try {
                const papersWithStringIds = results.map(paper => ({
                    ...paper,
                    paper_id: String(paper.paper_id)
                }));
                
                const response = await fetch(`${config.apiUrl}/api/summarize_papers`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ papers: papersWithStringIds, query }),
                });
                
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                
                const data = await response.json();
                if (!isMounted.current) return;

                if (validateSummaryResponse(data)) {
                    setState({ data, loading: false, error: null });
                } else {
                    throw new Error("Invalid summary response format");
                }
            } catch (err) {
                if (!isMounted.current) return;
                console.error("Summary error:", err);
                setState({ 
                    data: validateSummaryResponse(sampleResponse.summary) ? sampleResponse.summary : null,
                    loading: false, 
                    error: err instanceof Error ? err.message : "Failed to generate summary"
                });
            }
        };

        fetchSummary();
    }, [results, query]);

    return state;
}; 
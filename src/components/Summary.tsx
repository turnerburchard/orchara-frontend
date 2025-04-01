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

interface SummaryProps {
    results: Paper[];
    usingSampleData?: boolean;
    query: string;
}

const Summary = ({ results, usingSampleData = false, query }: SummaryProps) => {
    const [state, setState] = useState<{
        data: SummaryResponse | null;
        loading: boolean;
        error: string | null;
    }>({
        data: null,
        loading: false,
        error: null
    });
    const isMounted = useRef(true);
    
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

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!isMounted.current) return;

            if (usingSampleData) {
                if (validateSummaryResponse(sampleResponse.summary)) {
                    setState({ data: sampleResponse.summary, loading: false, error: null });
                }
                return;
            }

            setState(prev => ({ ...prev, loading: true, error: null, data: null }));

            try {
                const papersWithStringIds = results.map(paper => ({
                    ...paper,
                    paper_id: String(paper.paper_id)
                }));
                
                const response = await fetch(`${config.apiUrl}/api/summarize_papers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        papers: papersWithStringIds,
                        query: query
                    }),
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
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
                    data: null, 
                    loading: false, 
                    error: err instanceof Error ? err.message : "Failed to generate summary"
                });
            }
        };

        if (results && results.length > 0) {
            fetchSummary();
        } else {
            setState({ data: null, loading: false, error: null });
        }
    }, [results, usingSampleData, query]);

    const renderSummaryWithCitations = () => {
        if (!state.data?.summary || !state.data?.citations) return null;

        const { summary, citations } = state.data;
        const parts = summary.split(/(\{\{cite:\d+\}\})/g);

        return (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {parts.map((part, index) => {
                    const citationMatch = part.match(/\{\{cite:(\d+)\}\}/);
                    if (citationMatch) {
                        const citationId = parseInt(citationMatch[1]);
                        const citation = citations.find(c => c.id === citationId);
                        if (!citation) return '';

                        return (
                            <span key={index} className="group relative">
                                <a
                                    href={citation.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                                    title={`${citation.title}\n${citation.context}`}
                                >
                                    [{citationId}]
                                </a>
                            </span>
                        );
                    }
                    return part;
                })}
            </p>
        );
    };

    if (!results || results.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl mt-4">
            {state.loading ? (
                <p className="text-gray-600 dark:text-gray-300">Generating summary...</p>
            ) : state.error ? (
                <div className="text-red-600 dark:text-red-400">{state.error}</div>
            ) : state.data ? (
                <div className="prose dark:prose-invert max-w-none">
                    {renderSummaryWithCitations()}
                </div>
            ) : null}
        </div>
    );
};

export default Summary;

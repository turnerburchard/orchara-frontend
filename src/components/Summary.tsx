import { useMemo } from 'react';
import { sampleResponse } from '../mockData/sampleResponse';
import type { Paper } from '../types/paper';
import { useSummary } from '../hooks/useSummary';

interface SummaryProps {
    results: Paper[];
    query: string;
}

const Summary = ({ results, query }: SummaryProps) => {
    const state = useSummary(results, query);
    
    const isSampleData = useMemo(() => {
        if (!results?.length) return false;
        return results.length === sampleResponse.papers.length &&
            results.every((paper, index) => 
                paper.paper_id === sampleResponse.papers[index].paper_id &&
                paper.title === sampleResponse.papers[index].title
            );
    }, [results]);

    const renderSummaryWithCitations = () => {
        if (!state.data?.summary || !state.data?.citations) return null;

        const { summary, citations } = state.data;
        // Clean up extra spaces before periods
        const cleanedSummary = summary.replace(/\s+\./g, '.');
        const parts = cleanedSummary.split(/(\{\{cite:\d+\}\})/g);

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

    if (!results?.length) return null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm">
            {isSampleData && (
                <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
                    Note: Displaying sample data because the backend is unavailable
                </div>
            )}
            {state.loading ? (
                <p className="text-gray-600 dark:text-gray-300 italic">Generating summary...</p>
            ) : state.error ? (
                <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-4 py-3 rounded-lg">
                    {state.error}
                </div>
            ) : (
                <div className="prose dark:prose-invert max-w-none">
                    {renderSummaryWithCitations()}
                </div>
            )}
        </div>
    );
};

export default Summary;

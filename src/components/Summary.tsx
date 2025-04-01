import { useState, useEffect } from 'react';
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
}

const Summary = ({ results, usingSampleData = false }: SummaryProps) => {
    const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    
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
        const fetchSummary = async () => {
            if (usingSampleData) {
                if (validateSummaryResponse(sampleResponse.summary)) {
                    setSummaryData(sampleResponse.summary);
                }
                return;
            }

            setLoadingSummary(true);
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
                    body: JSON.stringify({ papers: papersWithStringIds }),
                });
                
                if (!response.ok) {
                    console.error("Summary API error:", await response.text());
                    return;
                }
                
                const data = await response.json();
                if (validateSummaryResponse(data)) {
                    setSummaryData(data);
                } else {
                    console.error("Invalid summary response format:", data);
                }
            } catch (err) {
                console.error("Summary error:", err);
            } finally {
                setLoadingSummary(false);
            }
        };

        if (results && results.length > 0) {
            fetchSummary();
        } else {
            setSummaryData(null);
        }
    }, [results, usingSampleData]);

    if (!results || results.length === 0) return null;

    const renderSummaryWithCitations = () => {
        if (!summaryData?.summary || !summaryData?.citations) return null;

        const { summary, citations } = summaryData;
        const parts = summary.split(/(\{\{cite:\d+\}\})/g);

        return parts.map((part, index) => {
            const citationMatch = part.match(/\{\{cite:(\d+)\}\}/);
            if (citationMatch) {
                const citationId = parseInt(citationMatch[1]);
                const citation = citations.find(c => c.id === citationId);

                if (!citation) return ''; // Skip invalid citations silently

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
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl mt-8">
            {/*<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Summary of Results:</h2>*/}
            {loadingSummary ? (
                <p className="text-gray-600 dark:text-gray-300">Loading summary...</p>
            ) : summaryData ? (
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {renderSummaryWithCitations()}
                    </p>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-300">No summary available.</p>
            )}
        </div>
    );
};

export default Summary;

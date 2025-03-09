import { useState, useEffect } from 'react';

interface SearchResult {
    title: string;
    abstract?: string;
    url?: string;
}

interface SummaryProps {
    results: SearchResult[];
}

const Summary = ({ results }: SummaryProps) => {
    const [summary, setSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoadingSummary(true);
            setSummaryError(null);
            try {
                const titles = results.map((result: SearchResult) => result.title).join(', ');

                const response = await fetch('/api/summarize', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: `${titles}` }),
                });
                const data = await response.json();
                if (data.summary) {
                    setSummary(data.summary);
                } else {
                    setSummaryError("No summary available.");
                }
            } catch (err) {
                setSummaryError("Error fetching summary.");
            }
            setLoadingSummary(false);
        };

        if (results && results.length > 0) {
            fetchSummary();
        } else {
            setSummary('');
        }
    }, [results]);

    // Do not render summary if no search results exist
    if (!results || results.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl mt-8">
            {/*<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Summary of Results:</h2>*/}
            {loadingSummary ? (
                <p className="text-gray-600 dark:text-gray-300">Loading summary...</p>
            ) : summaryError ? (
                <p className="text-red-600">{summaryError}</p>
            ) : summary ? (
                <p className="text-gray-700 dark:text-gray-300">{summary}</p>
            ) : (
                <p className="text-gray-600 dark:text-gray-300">No results to summarize.</p>
            )}
        </div>
    );
};

export default Summary;

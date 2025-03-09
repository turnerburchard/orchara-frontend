interface Paper {
    title: string;
    abstract?: string;
    url?: string;
}

interface ResultsProps {
    results: Paper[];
    selectedPaper: Paper | null;
    setSelectedPaper: (paper: Paper | null) => void;
}

const Results = ({ results, selectedPaper, setSelectedPaper }: ResultsProps) => {
    if (!results || results.length === 0) return null;

    const handlePaperClick = (paper: Paper) => {
        setSelectedPaper(paper);
    };

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Paper List */}
                <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Results:</h2>
                    <ul className="space-y-2">
                        {results.map((paper, index) => (
                            <li
                                key={index}
                                onClick={() => handlePaperClick(paper)}
                                className={`cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    selectedPaper === paper ? "bg-gray-200 dark:bg-gray-600" : ""
                                }`}
                            >
                                <strong>{paper.title}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Paper Details */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                    {selectedPaper ? (
                        <>
                            {/* Buttons Row */}
                            <div className="flex flex-wrap gap-4 mb-4">
                                {selectedPaper.url && (
                                    <button
                                        onClick={() => window.open(selectedPaper.url, '_blank')}
                                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700"
                                    >
                                        Read Full Paper
                                    </button>
                                )}
                                <button
                                    onClick={() => alert("View Author feature coming soon")}
                                    className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700"
                                >
                                    View Author
                                </button>
                                <button
                                    onClick={() => alert("View Citation Graph feature coming soon")}
                                    className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700"
                                >
                                    View Citation Graph
                                </button>
                            </div>
                            {/* Paper Abstract */}
                            <div>
                                {selectedPaper.abstract ? (
                                    <p className="leading-relaxed">{selectedPaper.abstract}</p>
                                ) : (
                                    <p>No abstract available.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p>Please select a paper to view its abstract.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;

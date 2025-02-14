import React from 'react';

const Results = ({ results, selectedPaper, setSelectedPaper }) => {
    // Only render if there are search results
    if (!results || results.length === 0) return null;

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
                                onClick={() => setSelectedPaper(paper)}
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
                    <h2 className="text-xl font-semibold mb-4">Abstract</h2>
                    {selectedPaper ? (
                        <div>
                            <h3 className="text-lg font-bold mb-2">{selectedPaper.title}</h3>
                            {selectedPaper.abstract ? (
                                <p className="leading-relaxed">{selectedPaper.abstract}</p>
                            ) : (
                                <p>No abstract available.</p>
                            )}
                        </div>
                    ) : (
                        <p>Please select a paper to view its abstract.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;

import React, { useState } from 'react';

const Search = ({ query, setQuery, onSearch, loading }) => {
    const [showSubtopics, setShowSubtopics] = useState(false);

    // Wrap the normal form submit to show subtopics after search
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(e);
        setShowSubtopics(true);
    };

    // Static subtopic names (to be generated dynamically later via LLM)
    const subtopics = [
        "Clustering",
        "Neural Networks",
        "Regression Analysis",
        "Support Vector Machines",
        "Dimensionality Reduction"
    ];

    // When a subtopic is clicked, update the search field and trigger the search
    const handleSubtopicClick = (topic) => {
        setQuery(topic);
        // Use a short delay to ensure state is updated before calling onSearch
        setTimeout(() => {
            onSearch({ preventDefault: () => {} });
        }, 100);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col">
                <input
                    type="text"
                    id="query"
                    placeholder="Enter your search query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                    className="bg-white px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:shadow-none"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Searching...' : 'Search'}
            </button>
            {showSubtopics && (
                <div className="space-y-4">
                    <h3 className="text-center text-gray-700 dark:text-gray-200 font-semibold">
                        Explore Related Topics
                    </h3>
                    <div className="grid grid-cols-5 gap-4">
                        {subtopics.map((topic, index) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => handleSubtopicClick(topic)}
                                title={topic}
                                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700 truncate"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </form>
    );
};

export default Search;

import React from 'react';

const Search = ({ query, setQuery, onSearch, loading }) => (
    <form onSubmit={onSearch} className="bg-white dark:bg-gray-800 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col">
            <input
                type="text"
                id="query"
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
        </div>
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:opacity-50"
        >
            {loading ? 'Searching...' : 'Search'}
        </button>
    </form>
);

export default Search;

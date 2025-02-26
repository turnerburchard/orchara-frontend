import React, { useState } from 'react';
import Header from './components/Header';
import Search from './components/Search';
import Summary from './components/Summary';
import Results from './components/Results';

function App() {
  const [query, setQuery] = useState('');
  const [clusterSize, setClusterSize] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for:", query, "with cluster size:", clusterSize);
    setError(null);
    setSelectedPaper(null);
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, cluster_size: clusterSize })
      });
      const data = await response.json();
      console.log("Received response:", data);
      if (!response.ok) {
        setError(data.error || 'Search failed.');
      } else {
        setResults(data.results);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <Header />
        <main className="container mx-auto p-4">
          <div className="flex flex-col items-center">
            {/* Search Area */}
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg mb-8">
              <Search
                  query={query}
                  setQuery={setQuery}
                  clusterSize={clusterSize}
                  setClusterSize={setClusterSize}
                  onSearch={handleSearch}
                  loading={loading}
              />
            </div>
            {/* Results Area: Only show if results exist */}
            {results.length > 0 && (
                <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg">
                  <Summary results={results} />
                  {error && <div className="mt-4 text-red-600">{error}</div>}
                  <Results
                      results={results}
                      selectedPaper={selectedPaper}
                      setSelectedPaper={setSelectedPaper}
                  />
                </div>
            )}
          </div>
        </main>
      </div>
  );
}

export default App;

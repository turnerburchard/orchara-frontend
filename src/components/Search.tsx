import { useState } from 'react';
import { BlackButton } from './ui/buttons';

interface SearchProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  loading: boolean;
}

const ENABLE_SUBTOPICS = false;

const Search: React.FC<SearchProps> = ({ query, setQuery, onSearch, loading }) => {
  const [showSubtopics, setShowSubtopics] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(e);
    if (ENABLE_SUBTOPICS) {
      setShowSubtopics(true);
    }
  };

  const subtopics: string[] = ENABLE_SUBTOPICS
      ? [
        "Clustering",
        "Neural Networks",
        "Regression Analysis",
        "Support Vector Machines",
        "Dimensionality Reduction",
      ]
      : [];

  const handleSubtopicClick = (topic: string) => {
    setQuery(topic);
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    onSearch(syntheticEvent);
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
              className="bg-white px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:shadow-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          />
        </div>
        <BlackButton
            type="submit"
            disabled={loading}
            className="w-full py-3"
        >
          {loading ? 'Searching...' : 'Search'}
        </BlackButton>
        {ENABLE_SUBTOPICS && showSubtopics && (
            <div className="space-y-4">
              <h3 className="text-center text-gray-700 dark:text-gray-200 font-semibold">
                Explore Related Topics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {subtopics.map((topic, index) => (
                    <BlackButton
                        key={index}
                        onClick={() => handleSubtopicClick(topic)}
                        title={topic}
                        className="truncate"
                    >
                      {topic}
                    </BlackButton>
                ))}
              </div>
            </div>
        )}
      </form>
  );
};

export default Search;

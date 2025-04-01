import './App.css'
import Header from './components/Header'
import Search from './components/Search'
import Summary from './components/Summary'
import Results from './components/Results'
import { useSearch } from './hooks/useSearch'

function App(): JSX.Element {
  const {
    query,
    setQuery,
    results,
    loading,
    selectedPaper,
    setSelectedPaper,
    handleSearch
  } = useSearch();

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center w-full">
          {/* Search Area */}
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg mb-8 mt-8">
            <Search
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
          {/* Results Area */}
          {results.length > 0 && (
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg">
              <Summary 
                results={results} 
                query={query}
              />
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
  )
}

export default App 
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Search from './components/Search'
import Summary from './components/Summary'
import Results from './components/Results'
import config from './config'


interface Paper {
  title: string
  abstract?: string
  url?: string
}

function App(): JSX.Element {
  const [query, setQuery] = useState<string>('')
  const [clusterSize, setClusterSize] = useState<number>(5)
  const [results, setResults] = useState<Paper[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Starting search with query:", query, "cluster size:", clusterSize)
    setError(null)
    setSelectedPaper(null)
    setLoading(true)
    try {
      const response = await fetch(`${config.apiUrl}/search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          query: query,
          cluster_size: clusterSize 
        })
      })
      
      console.log("Raw response:", response)
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers))
      
      const responseText = await response.text()
      console.log("Raw response text:", responseText)
      
      if (!responseText) {
        throw new Error('Empty response from server')
      }

      try {
        const data = JSON.parse(responseText)
        console.log("Parsed response data:", data)
        if (!response.ok) {
          setError(data.error || 'Search failed.')
        } else if (!data.results) {
          setError('Invalid response format: missing results')
        } else {
          setResults(data.results)
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error('Invalid JSON response from server')
      }
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center w-full">
          {/* Search Area */}
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg mb-8">
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
  )
}

export default App 
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Search from './components/Search'
import Summary from './components/Summary'
import Results from './components/Results'
import config from './config'
import { sampleResponse } from './mockData/sampleResponse'
import type { Paper, ApiResponse } from './types'

function App(): JSX.Element {
  const [query, setQuery] = useState<string>('')
  const [clusterSize] = useState<number>(5)
  const [results, setResults] = useState<Paper[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Starting search with query:", query, "cluster size:", clusterSize)
    setSelectedPaper(null)
    setLoading(true)
    setUsingSampleData(false)
    
    try {
      console.log("API URL:", config.apiUrl);
      const response = await fetch(`${config.apiUrl}/api/search`, {
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

      const data = JSON.parse(responseText) as ApiResponse;
      console.log("Parsed response data:", data)
      if (!response.ok) {
        throw new Error(data.error || 'Search failed.')
      } else if (!data.results) {
        throw new Error('Invalid response format: missing results')
      } else {
        setResults(data.results)
      }
    } catch (err) {
      console.error("Search error:", err)
      // Use sample data as fallback
      setResults(sampleResponse.papers.map(paper => ({
        paper_id: String(paper.paper_id),
        title: paper.title,
        abstract: paper.abstract,
        url: paper.url
      })))
      setUsingSampleData(true)
    } finally {
      setLoading(false)
    }
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
              {usingSampleData && (
                <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
                  Note: Displaying sample data because the backend is unavailable
                </div>
              )}
              <Summary results={results} usingSampleData={usingSampleData} />
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
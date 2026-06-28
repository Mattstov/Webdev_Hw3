import { useState } from "react"
import { type Book } from './BookCard'

type SearchBarProps = {
  onAdd: (book: Book) => void
  libraryIds: string[]
}

type SearchResult = {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

function SearchBar({ onAdd, libraryIds }: SearchBarProps) {
  const [typed, setTyped] = useState('')
  const [apiResult, setApiResult] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    setError('')
    setApiResult([])
    try {
      setLoading(true)
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(typed)}&limit=10`
      )
      if (!response.ok) throw new Error('Bad response')
      const data = await response.json() as { docs: SearchResult[] }
      setApiResult(data.docs)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <form
        onSubmit={e => { e.preventDefault(); handleSearch() }}
        className="flex gap-2 mb-3"
      >
        <input
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Search for a book..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading || typed.trim() === ''}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {apiResult.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900 shadow-sm mb-6">
          {apiResult.map(result => {
            const alreadyAdded = libraryIds.includes(result.key) // disable Add if already in library
            const coverUrl = result.cover_i
              ? `https://covers.openlibrary.org/b/id/${result.cover_i}-S.jpg`
              : null
            return (
              <div key={result.key} className="flex items-center gap-3 px-4 py-3">
                {coverUrl
                  ? <img src={coverUrl} alt="" className="w-9 h-12 object-cover rounded shrink-0" />
                  : <div className="w-9 h-12 bg-gray-100 dark:bg-gray-800 rounded shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{result.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {result.author_name?.[0] ?? 'Unknown'}
                    {result.first_publish_year ? ` · ${result.first_publish_year}` : ''}
                  </p>
                </div>
                <button
                  disabled={alreadyAdded}
                  onClick={() => onAdd({
                    id: result.key,
                    title: result.title,
                    author: result.author_name?.[0] ?? 'Unknown',
                    year: result.first_publish_year ?? 0,
                    coverId: result.cover_i,
                    status: 'to-read',
                    dateAdded: Date.now(),
                  })}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {alreadyAdded ? 'Added' : '+ Add'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchBar

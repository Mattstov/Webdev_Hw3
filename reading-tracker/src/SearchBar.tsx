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
    <div>
      <form onSubmit={e => { e.preventDefault(); handleSearch() }}>
        <input
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Search for a book..."
        />
        <button type="submit" disabled={loading || typed.trim() === ''}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {apiResult.length > 0 && (
        <ul>
          {apiResult.map(result => {
            const alreadyAdded = libraryIds.includes(result.key)
            const coverUrl = result.cover_i
              ? `https://covers.openlibrary.org/b/id/${result.cover_i}-S.jpg`
              : null
            return (
              <li key={result.key}>
                {coverUrl && <img src={coverUrl} alt="" width={40} />}
                <span>{result.title}</span>
                {' — '}
                <span>{result.author_name?.[0] ?? 'Unknown'}</span>
                {result.first_publish_year ? ` (${result.first_publish_year})` : ''}
                {' '}
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
                >
                  {alreadyAdded ? 'Added' : 'Add'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default SearchBar

import { useState, useEffect } from 'react'
import BookCard, { type Book } from './BookCard'
import SearchBar from './SearchBar'
import StatsBar from './StatsBar'

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('darkMode') === 'true'
      if (saved) document.documentElement.classList.add('dark')
      return saved
    } catch {
      return false
    }
  })

  const [library, setLibrary] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('library')
      return saved ? (JSON.parse(saved) as Book[]) : []
    } catch {
      return []
    }
  })

  const [filterStatus, setFilterStatus] = useState<'all' | 'to-read' | 'reading' | 'finished'>('all')
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'dateAdded'>('dateAdded')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    localStorage.setItem('library', JSON.stringify(library))
  }, [library])

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  function handleAdd(book: Book) {
    if (library.some(b => b.id === book.id)) return
    setLibrary(prev => [...prev, book])
  }

  const displayed = library
    .filter(book => filterStatus === 'all' || book.status === filterStatus)
    .sort((a, b) => {
      const valA: string | number = sortBy === 'dateAdded' ? a.dateAdded : a[sortBy].toLowerCase()
      const valB: string | number = sortBy === 'dateAdded' ? b.dateAdded : b[sortBy].toLowerCase()
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const libraryIds = library.map(b => b.id)

  return (
    <div>
      <div>
        <h1>Reading Tracker</h1>
        <button onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <SearchBar onAdd={handleAdd} libraryIds={libraryIds} />

      <StatsBar library={library} />

      <div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
        >
          <option value="all">All</option>
          <option value="to-read">To Read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="dateAdded">Sort by Date Added</option>
        </select>

        <select
          value={sortDir}
          onChange={e => setSortDir(e.target.value as typeof sortDir)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {displayed.length === 0 ? (
        <p>
          {library.length === 0
            ? 'Your library is empty. Search for a book to get started!'
            : 'No books match this filter.'}
        </p>
      ) : (
        <div>
          {displayed.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={id => setLibrary(prev => prev.filter(b => b.id !== id))}
              onStatusChange={(id, status) =>
                setLibrary(prev => prev.map(b => b.id === id ? { ...b, status } : b))
              }
              onRate={(id, rating) =>
                setLibrary(prev => prev.map(b => b.id === id ? { ...b, rating } : b))
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App

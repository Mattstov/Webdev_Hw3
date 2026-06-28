import { useState, useEffect } from 'react'
import BookCard, { type Book } from './BookCard'
import SearchBar from './SearchBar'
import StatsBar from './StatsBar'

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('darkMode') === 'true'
      if (saved) document.documentElement.classList.add('dark') // apply before first render
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
      return [] // if localStorage is corrupt just start fresh
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
    if (library.some(b => b.id === book.id)) return // skip duplicates
    setLibrary(prev => [...prev, book])
  }

  // filter first, then sort — lowercase so casing doesn't affect order
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
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Reading Tracker</h1>
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <SearchBar onAdd={handleAdd} libraryIds={libraryIds} />

        <StatsBar library={library} />

        <div className="flex flex-wrap gap-2 mb-6">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="dateAdded">Sort by Date Added</option>
          </select>

          <select
            value={sortDir}
            onChange={e => setSortDir(e.target.value as typeof sortDir)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {displayed.length === 0 ? (
          <p className="text-center py-20 text-gray-400 dark:text-gray-500">
            {library.length === 0
              ? 'Your library is empty. Search for a book to get started!'
              : 'No books match this filter.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  )
}

export default App

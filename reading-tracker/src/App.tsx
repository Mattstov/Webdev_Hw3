import { useState } from 'react'
import BookCard, { type Book } from './BookCard'
import SearchBar from './SearchBar'

function App() {
  const [library, setLibrary] = useState<Book[]>([])

  return (
    <>
      <div>
        <h1>Reading Tracker</h1>
      </div>

      <SearchBar onAdd={(book) => {setLibrary([...library, book])}}></SearchBar>

      {library.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onDelete={() => {}} 
          onStatusChange={() => {}} 
          onRate={() => {}} 
        />
      ))}



    </>
  )
}

export default App

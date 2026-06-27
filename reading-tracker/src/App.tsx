import { useState } from 'react'
import './App.css'
import BookCard from './BookCard'
import {Book} from './BookCard'

function App() {
  const [library, setLibrary] = useState<Book[]>([])
   {library.map(book => (
     <BookCard key={book.id} book={book} onDelete={() => {}} onStatusChange={() => {}} onRate={() => {}} />
   ))}
  return (
    <div>
      <h1>Reading Tracker</h1>
    </div>
  )
}

export default App
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import BookCard from './BookCard'

function App() {
  const fakebook = {
    id : "id0",
    title : "Comp text 1",
    author : "i dunno",
    year : 10,
    status : "to-read",
    dateAdded : 1719500000000


  }
  return (
    <div>
      <h1>Reading Tracker</h1>
      <BookCard book={fakebook}/>
    </div>
  )
}

export default App
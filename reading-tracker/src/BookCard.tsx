//Book type
type Book = {
  id: string
  title: string
  author: string
  year: number
  coverId?: number
  status: 'to-read' | 'reading' | 'finished'
  rating?: number
  dateAdded: number
}

function BookCard({book}: {book: Book}) {
  return ( //component skeleton
    <div>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <p>{book.year}</p>
      <p>{book.status}</p>
    </div>
  )


}

export default BookCard
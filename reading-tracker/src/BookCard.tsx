//Book type
export type Book = {
  id: string
  title: string
  author: string
  year: number
  coverId?: number
  status: 'to-read' | 'reading' | 'finished'
  rating?: number
  dateAdded: number
}

 type BookCardProps = {
    book : Book
    onDelete : (id: string) => void
    onStatusChange : (id : string, status: Book['status']) => void
    onRate : (id: string, rating: number) => void
}

function BookCard({book, onDelete, onStatusChange, onRate }: BookCardProps) {
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

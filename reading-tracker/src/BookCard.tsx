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

export type BookCardProps = {
  book: Book
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Book['status']) => void
  onRate: (id: string, rating: number) => void
}

function BookCard({ book, onDelete, onStatusChange, onRate }: BookCardProps) {
  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    : null

  return (
    <div>
      {coverUrl
        ? <img src={coverUrl} alt={book.title} width={120} />
        : <div>[No Cover]</div>
      }
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      {book.year > 0 && <p>{book.year}</p>}
      <p>Status: {book.status}</p>

      {book.status === 'finished' && (
        <div>
          <span>Rating: </span>
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => onRate(book.id, star)}>
              {(book.rating ?? 0) >= star ? '★' : '☆'}
            </button>
          ))}
        </div>
      )}

      <div>
        {book.status !== 'finished' && (
          <button onClick={() => onStatusChange(book.id, book.status === 'to-read' ? 'reading' : 'finished')}>
            {book.status === 'to-read' ? 'Start Reading' : 'Mark Finished'}
          </button>
        )}
        {book.status !== 'to-read' && (
          <button onClick={() => onStatusChange(book.id, book.status === 'finished' ? 'reading' : 'to-read')}>
            Move Back
          </button>
        )}
        <button onClick={() => onDelete(book.id)}>Delete</button>
      </div>
    </div>
  )
}

export default BookCard

export type Book = {
  id: string
  title: string
  author: string
  year: number
  coverId?: number
  status: 'to-read' | 'reading' | 'finished'
  rating?: number
  dateAdded: number // timestamp for sorting by date added
}

export type BookCardProps = {
  book: Book
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Book['status']) => void
  onRate: (id: string, rating: number) => void
}

const statusBadge: Record<Book['status'], string> = {
  'to-read':  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  'reading':  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'finished': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

const statusLabel: Record<Book['status'], string> = {
  'to-read':  'To Read',
  'reading':  'Reading',
  'finished': 'Finished',
}

function BookCard({ book, onDelete, onStatusChange, onRate }: BookCardProps) {
  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    : null

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {coverUrl
        ? <img src={coverUrl} alt={book.title} className="w-full h-48 object-cover" />
        : <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm">No cover</div>
      }

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold leading-tight">{book.title}</h2>
          <span className={"shrink-0 text-xs font-medium px-2 py-0.5 rounded-full " + statusBadge[book.status]}>
            {statusLabel[book.status]}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
        {book.year > 0 && <p className="text-xs text-gray-400 dark:text-gray-500">{book.year}</p>}

        {/* rating only shows once the book is finished */}
        {book.status === 'finished' && (
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => onRate(book.id, star)}
                className={(book.rating ?? 0) >= star
                  ? 'text-yellow-400 text-xl hover:scale-110 transition-transform'
                  : 'text-gray-300 dark:text-gray-600 text-xl hover:text-yellow-300 transition-colors'
                }
              >
                {(book.rating ?? 0) >= star ? '★' : '☆'}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto pt-3">
          {book.status !== 'finished' && (
            <button
              onClick={() => onStatusChange(book.id, book.status === 'to-read' ? 'reading' : 'finished')}
              className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors font-medium"
            >
              {book.status === 'to-read' ? 'Start Reading' : 'Mark Finished'}
            </button>
          )}
          {book.status !== 'to-read' && (
            <button
              onClick={() => onStatusChange(book.id, book.status === 'finished' ? 'reading' : 'to-read')}
              className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Move Back
            </button>
          )}
          <button
            onClick={() => onDelete(book.id)}
            className="text-xs px-2 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard

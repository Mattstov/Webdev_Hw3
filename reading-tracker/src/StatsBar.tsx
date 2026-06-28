import { type Book } from './BookCard'

type StatsBarProps = {
  library: Book[]
}

function StatsBar({ library }: StatsBarProps) {
  const toRead = library.filter(b => b.status === 'to-read').length
  const reading = library.filter(b => b.status === 'reading').length
  const finished = library.filter(b => b.status === 'finished').length

  // only average books that have actually been rated
  const ratedBooks = library.filter(b => b.status === 'finished' && b.rating !== undefined)
  const avgRating =
    ratedBooks.length > 0
      ? (ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBooks.length).toFixed(1)
      : null

  if (library.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3 items-center px-4 py-3 mb-6 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
      <span><strong className="text-gray-900 dark:text-white">{toRead}</strong> to read</span>
      <span className="text-gray-300 dark:text-gray-600">·</span>
      <span><strong className="text-gray-900 dark:text-white">{reading}</strong> reading</span>
      <span className="text-gray-300 dark:text-gray-600">·</span>
      <span><strong className="text-gray-900 dark:text-white">{finished}</strong> finished</span>
      {avgRating && (
        <>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>avg rating <strong className="text-gray-900 dark:text-white">{avgRating}</strong></span>
        </>
      )}
    </div>
  )
}

export default StatsBar

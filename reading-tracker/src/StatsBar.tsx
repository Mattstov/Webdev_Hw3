import { type Book } from './BookCard'

type StatsBarProps = {
  library: Book[]
}

function StatsBar({ library }: StatsBarProps) {
  const toRead = library.filter(b => b.status === 'to-read').length
  const reading = library.filter(b => b.status === 'reading').length
  const finished = library.filter(b => b.status === 'finished').length

  const ratedBooks = library.filter(b => b.status === 'finished' && b.rating !== undefined)
  const avgRating =
    ratedBooks.length > 0
      ? (ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBooks.length).toFixed(1)
      : null

  if (library.length === 0) return null

  return (
    <div className="flex flex-wrap gap-4 items-center px-4 py-3 mb-6 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
      <span><span className="font-semibold text-gray-900 dark:text-white">{toRead}</span> to read</span>
      <span className="text-gray-300 dark:text-gray-600">·</span>
      <span><span className="font-semibold text-gray-900 dark:text-white">{reading}</span> reading</span>
      <span className="text-gray-300 dark:text-gray-600">·</span>
      <span><span className="font-semibold text-gray-900 dark:text-white">{finished}</span> finished</span>
      {avgRating && (
        <>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>avg rating <span className="font-semibold text-gray-900 dark:text-white">★ {avgRating}</span></span>
        </>
      )}
    </div>
  )
}

export default StatsBar

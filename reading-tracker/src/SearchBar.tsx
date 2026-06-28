import { useState } from "react"
import { type Book } from './BookCard'

type SearchBarProps = {
  onAdd: (book: Book) => void

}

type SearchResult = {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

function SearchBar({onAdd}: SearchBarProps) {
    // handle what is expect of a search bar using useState hooks.

    const [typed, setTyped] = useState('')
    const [apiResult, setApiResult] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // do the search as an async function
    async function handleSearch() {
        setError('');
        try {
            setLoading(true);

            const response = await fetch(`https://openlibrary.org/search.json?q=${typed}&limit=10`)
            
            if (!response.ok) throw new Error('Bad response')

            const data = await response.json()
            setApiResult(data.docs)

            setLoading(false) 
        } catch (error) {
            setError('Something went wrong. Please try again.');
            setLoading(false) 
        }
        
    }

    return(
        <>
            <form onSubmit={(e) => {
                    e.preventDefault() 
                    handleSearch()
            }}>

                <input 
                type="text"
                value = {typed}
                onChange={(e) => setTyped(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>

            {apiResult.map(result => (
                <div key={result.key}>
                    {result.title}
                    <button onClick={() => onAdd({
                        id: result.key,
                        title: result.title,
                        author: result.author_name?.[0] ?? 'Unknown',
                        year: result.first_publish_year ?? 0,
                        coverId: result.cover_i,
                        status: 'to-read',
                        dateAdded: Date.now()
                        })}>add</button>
                </div>

            ))}
        </>
    )

}

export default SearchBar
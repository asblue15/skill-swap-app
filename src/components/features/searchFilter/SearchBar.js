
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const SearchBar = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add search logic here      
    }
  return (
    <div>
        <form className="flex items-center justify-center mt-4 mb-4"
        onSubmit={handleSubmit}>
            //replace shared input here
            <input type="text" placeholder="Search..." className="border border-gray-300 rounded-l px-4 py-2 w-1/2" />
            //replace shared button here
            <button type="submit" className="bg-blue-500 text-white rounded-r px-4 py-2">
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </button>
        </form>
    </div>
  )
}

export default SearchBar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
/*TODO:
    1.add debounce to the search bar to avoid too many re-renders (lodash.debounce)
    2.add a clear button to the search bar to clear the input
*/

const SearchBar = ({ value, onChange }) => {
  return (
    <div className='flex w-full p-2'>
      {/* <label className="block mb-1 font-medium text-[#2F2D2E]">Search by Name</label> */}
      <div className="relative w-full">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="e.g. Alice"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border px-10 py-1 rounded"
        />
      </div>
    </div>
  )
}

export default SearchBar


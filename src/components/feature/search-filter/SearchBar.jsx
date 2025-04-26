import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex w-full p-2 sm:p-4">
      <div className="relative w-full">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
        />
        <input
          type="text"
          placeholder="e.g. Alice"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-10 py-2 sm:py-3 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search by name"
          role="searchbox"
        />
      </div>
    </div>
  );
};

export default SearchBar;

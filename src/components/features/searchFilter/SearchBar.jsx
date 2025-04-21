/*TODO:
    1.add debounce to the search bar to avoid too many re-renders (lodash.debounce)
    2.add a clear button to the search bar to clear the input
*/
const SearchBar = ({value,onChange}) => {
    return (
      <div>
      <label className="block mb-1 font-medium">Search by Name</label>
      <input
        type="text"
        placeholder="e.g. Alice"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />
    </div>
    )
  }
 
  export default SearchBar


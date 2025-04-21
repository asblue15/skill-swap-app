import {FilterSkill, SearchBar} from '../components/features/searchFilter';

function SearchPage() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search Page</h1>
        <SearchBar />
        <FilterSkill />
        </div>
    );
}

export default SearchPage;
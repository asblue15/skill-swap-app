import { useState } from 'react';
import SearchBar from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faCheck, faFilter } from '@fortawesome/free-solid-svg-icons';


/*
TODO:
Usage of this component: fetch data from parent component and pass it as props to this component.
Display results based on the filter applied: 


Functionality enhancement:
    1. clear filter button - DONE
    2. remember previous filter (localStorage) - optional
    3. add multiple-select - DONE
    4. add real-time validation for this form - semi-DONE
    5. unit test
UI/UX enhancement:
    1. responsive design && improve accessibility 
    2. refine tailwind classes to align with the whole app
    3. add icons to the filter options - DONE
    4. add hover effect to the filter options/tooptips
    5. add animation to the filter options - optinal
    6. replace alert with modal
Refactoring and optimization: 
*/

// {data} is fetched data from parent pass down. 
// {onFilter} a cb to pass the selected filters to the parent component.
const FilterSkill = ({ data, onFilter }) => {
  // State hooks for filter options
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchName, setSearchName] = useState('');


  // Handle skill selection
  const toggleSkillSelection = (skill) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill) // Remove skill if already selected
        : [...prevSkills, skill] // Add skill if not selected
    );
  };
  // Handle filter submit
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate filters
    if (!selectedSkills.length && !selectedLevel && !selectedType && !searchName) {
      //alert can be annoying, consider using a toast notification or modal instead
      alert('Please select at least one filter option')
      return
    }
    onFilter({
      skill: selectedSkills,
      level: selectedLevel,
      type: selectedType,
      name: searchName.toLowerCase()
    });
  };
  // Handle filter reset
  const handleResetFilter = () => {
    setSelectedCategoryId(null);
    setSelectedSkills([]);
    setSelectedLevel('');
    setSelectedType('');
    setSearchName('');
  };


  return (
    //Submit here in form to allow user enter + click button
    <form className="p-4 border rounded-lg shadow-md space-y-4 bg-white max-w-md"
    onSubmit= {handleSubmit}
    >
      <h2 className="text-lg font-semibold">User Filter</h2>


      {/* Name Search - <SearchBar/> here */}
      <div>
  <label className="block font-medium mb-1">Search</label>
  <div className="flex items-center gap-2">
    <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
    <SearchBar value={searchName} onChange={setSearchName} />
  </div>
  {searchName && searchName.length < 3 && (
    <p className="text-red-500 text-sm">Search name must be at least 3 characters long.</p>
  )}
    </div>
     
      {/* Skill Category + Skill Selection */}
      <div>
        <label className="block font-medium mb-1">Skill Category</label>
        {data.categories.map(category => (
          <div key={category.id}>
            <button
              type="button"
              className={`font-semibold ${selectedCategoryId === category.id ? 'text-blue-600' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategoryId(category.id);
                setSelectedSkills([]);
              }}
            >
              <FontAwesomeIcon icon={faFilter} />
              {category.name}
            </button>
            {/* Nested Skill List */}
            {selectedCategoryId === category.id && (
              <ul className="ml-4 mt-1 space-y-1">
                {category.skills.map(skill => (
                  <li key={skill}>
                    <label className="flex items-center gap-2 text-[#2F2D2E]">
                      <input
                        type="checkbox"
                        name="skill"
                        value={skill}
                        checked={selectedSkills.includes(skill)} // checked if skill is in selectedSkills
                        onChange={() => toggleSkillSelection(skill)} // toggle skill selection
                      />
                      <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                      {skill}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>


      {/* Skill Level Dropdown */}
      <div className="text-[#2F2D2E]">
        <label className="block font-medium mb-1 text-[#2F2D2E]">Skill Level</label>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>


      {/* Skill Type Dropdown */}
      <div className = "text-[#2F2D2E]">
        <label className="block font-medium mb-1 text-[#2F2D2E]">Skill Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">All Types</option>
          <option value="canTeach">canTeach</option>
          <option value="wantsToLearn">wantsToLearn</option>
        </select>
      </div>


      {/* Apply Button */}
      <button
     
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Apply Filter
      </button>
      <button
        type="button"
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
          !selectedSkills.length && !selectedLevel && !selectedType && !searchName
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={handleResetFilter}
        disabled={!selectedSkills.length && !selectedLevel && !selectedType && !searchName}
      >
        <FontAwesomeIcon icon={faTimes} />
        Clear
      </button>
    </form>
  );
};


export default FilterSkill;



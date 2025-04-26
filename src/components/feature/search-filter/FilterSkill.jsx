import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
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
export default function FilterSkill({
  data,
  onFilter,
  searchName,
  onSearchNameChange,
  handleReset,
}) {
  // State hooks for filter options
  // const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [openCategory, setOpenCategory] = useState(null);

  const handleToggleCategory = (id) => {
    setOpenCategory((prev) => (prev === id ? null : id));
  };

  // Handle skill selection
  const toggleSkillSelection = (skill) => {
    setSelectedSkills(
      (prevSkills) =>
        prevSkills.includes(skill)
          ? prevSkills.filter((s) => s !== skill) // Remove skill if already selected
          : [...prevSkills, skill] // Add skill if not selected
    );
  };

  // Handle filter submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate filters
    if (!selectedSkills.length && !selectedLevel && !selectedType) {
      //alert can be annoying, consider using a toast notification or modal instead
      alert('Please select at least one filter option');
      return;
    }
    onFilter({
      skill: selectedSkills,
      level: selectedLevel,
      type: selectedType,
    });
  };

  // Handle filter reset
  const handleResetFilter = () => {
    // reset searchInput and user list
    handleReset();
    // Reset all filter states
    setSelectedSkills([]);
    setSelectedLevel('');
    setSelectedType('');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-md h-fit sticky top-16 flex flex-col justify-between max-h-[calc(100vh-4rem)] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full  [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <h2 className="text-xl font-semibold mb-4 text-[#2F2D2E] dark:text-gray-100">Filters</h2>
      <SearchBar value={searchName} onChange={onSearchNameChange} />
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Skill Category */}
        <div>
          <label className="block font-medium mb-2 text-[#2F2D2E] dark:text-gray-100">
            Skill Category
          </label>
          <div className="">
            {data.categories.map((category) => (
              <div key={category.id}>
                {/* Toggle Header */}
                <button
                  type="button"
                  onClick={() => handleToggleCategory(category.id)}
                  className="flex items-center justify-between w-full text-sm font-medium !text-gray-700 !focus:outline-none !focus:ring-0 dark:text-white py-2 px-1 !bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
                >
                  <span>{category.name}</span>
                  <span className="text-lg">{openCategory === category.id ? '▾' : '▸'}</span>
                </button>

                {/* Skills List with transition */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openCategory === category.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="ml-2 mt-2 space-y-2 pl-2 border-l border-gray-300 dark:border-gray-600">
                    {category.skills.map((skill) => (
                      <li key={skill}>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-pink-500 checked:border-pink-500 transition duration-150 ease-in-out"
                            value={skill}
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkillSelection(skill)}
                          />
                          <span
                            className={`text-sm font-medium ${
                              selectedSkills.includes(skill)
                                ? 'text-pink-600 font-semibold'
                                : 'text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {skill}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Level Dropdown */}
        <div className="text-[#2F2D2E] dark:text-gray-100">
          <label className="block font-medium mb-2 text-[#2F2D2E] dark:text-gray-100">
            Skill Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-100 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Skill Type Dropdown */}
        <div className="text-[#2F2D2E] dark:text-gray-100">
          <label className="block font-medium mb-2">Skill Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-100 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="Teach">Teach</option>
            <option value="Learn">Learn</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Apply
          </button>
          <button
            type="button"
            className={`bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 ${
              selectedSkills.length === 0 &&
              selectedLevel === '' &&
              selectedType === '' &&
              searchName.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleResetFilter}
            disabled={
              searchName.length === 0 && !selectedSkills.length && !selectedLevel && !selectedType
            }
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


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
  // const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // const [isFilterToggled, setIsFilterToggled] = useState(false); // State to track if filter is toggled


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
    // setIsFilterToggled(false); // Close the filter dropdown

    // Validate filters
    if (!selectedSkills.length && !selectedLevel && !selectedType) {
      //alert can be annoying, consider using a toast notification or modal instead
      alert('Please select at least one filter option')
      return
    }
    onFilter({
      skill: selectedSkills,
      level: selectedLevel,
      type: selectedType,
    });
  };
  // Handle filter reset
  const handleResetFilter = () => {
    // setSelectedCategoryId(null);
    setSelectedSkills([]);
    setSelectedLevel('');
    setSelectedType('');
  };

  return (
    <div className="p-6 bg-white shadow-md h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-[#2F2D2E]">Filters</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Skill Category */}
        <div>
          <label className="block font-medium mb-2 text-[#2F2D2E]">Skill Category</label>
          <div className="overflow-y-auto max-h-48">
            {data.categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center space-x-4">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="text-center font-semibold text-[#2F2D2E]">{category.name}</span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
                <ul className="ml-4 mt-2 space-y-2">
                  {category.skills.map((skill) => (
                    <li key={skill}>
                      <label className="flex items-center gap-2 text-[#2F2D2E]">
                        <input
                          type="checkbox"
                          className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
                          value={skill}
                          checked={selectedSkills.includes(skill)}
                          onChange={() => toggleSkillSelection(skill)}
                        />
                        {skill}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Level Dropdown */}
        <div>
          <label className="block font-medium mb-2 text-[#2F2D2E]">Skill Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Skill Type Dropdown */}
        <div>
          <label className="block font-medium mb-2 text-[#2F2D2E]">Skill Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            Apply Filter
          </button>
          <button
            type="button"
            className={`bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 ${
              !selectedSkills.length && !selectedLevel && !selectedType
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleResetFilter}
            disabled={!selectedSkills.length && !selectedLevel && !selectedType}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};


export default FilterSkill;



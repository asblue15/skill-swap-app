import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';


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

  const [isFilterToggled, setIsFilterToggled] = useState(false); // State to track if filter is toggled


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
    setIsFilterToggled(false); // Close the filter dropdown

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
    //Submit here in form to allow user enter + click button

    <div>

      <div className={`w-fit h-fit border p-2 rounded-lg flex items-center justify-center cursor-pointer ${isFilterToggled ? 'bg-[#41292C] hover:bg-[#792359]' : 'bg-[#792359] hover:bg-[#41292C]'}`} onClick={() => setIsFilterToggled(!isFilterToggled)}>
        <FontAwesomeIcon icon={faFilter} />
      </div>

      {isFilterToggled &&
        <div className="relative">
          <div id="dropdownSearch" class="z-50 absolute left-0 top-0 bg-white rounded-lg shadow-sm w-80 dark:bg-gray-700">
            <form
              className="p-4 border rounded-lg shadow-md space-y-4 bg-white max-w-md"
              onSubmit={handleSubmit}
            >
              <h2 className="text-lg font-semibold text-[#2F2D2E]">User Filter</h2>
              <div className="overflow-y-auto h-48">
                <label className="block font-medium mb-1 text-[#2F2D2E]">Skill Category</label>
                {data.categories.map(category => (
                  <div key={category.id}>
                    <div className="flex items-center space-x-4">
                      <hr className="flex-grow border-t-2 border-gray-800" />
                      <span className="text-center font-semibold text-[#2F2D2E]">{category.name}</span>
                      <hr className="flex-grow border-t-2 border-gray-800" />
                    </div>
                    <ul className="ml-4 mt-1 space-y-1">
                      {category.skills.map(skill => (
                        <li key={skill}>
                          <label className="flex items-center gap-2 text-[#2F2D2E]">
                            <input
                              type="checkbox"
                              name="skill"
                              className="w-4 h-4 border-gray-300 rounded-sm focus:ring-white"
                              value={skill}
                              checked={selectedSkills.includes(skill)} // checked if skill is in selectedSkills
                              onChange={() => toggleSkillSelection(skill)} // toggle skill selection
                            />
                            {skill}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Skill Level Dropdown */}
                <div className="text-[#2F2D2E] py-2">
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
                <div className="text-[#2F2D2E]">
                  <label className="block font-medium mb-1 text-[#2F2D2E]">Skill Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">All Types</option>
                    <option value="Teach">Teach</option>
                    <option value="Learn">Learn</option>
                  </select>
                </div>
              </div>

              <div className='space-x-2'>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Apply Filter
                </button>

                <button
                  type="button"
                  className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${!selectedSkills.length && !selectedLevel && !selectedType
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                    }`}
                  onClick={handleResetFilter}
                  disabled={!selectedSkills.length && !selectedLevel && !selectedType}
                  aria-lable = "Clear filter"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      }


    </div>

  );
};


export default FilterSkill;



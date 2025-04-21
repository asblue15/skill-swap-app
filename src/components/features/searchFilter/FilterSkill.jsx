import { useState } from 'react';
import SearchBar from './SearchBar';


/*
TODO:
Usage of this component
Display results based on the filter applied.


Feature enhancement:
    1. clear filter button
    2. remember previous filter (localStorage)
    3. reponsive layout
    4. add multiple-select
    5. smart filter chips
    6. unit test
UI enhancement:
    1.responsive design
    2. add icons to the filter options
    3. add hover effect to the filter options/tooptips
    4. add animation to the filter options
*/


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
  // Handle filter apply click
  const handleSubmit = (e) => {
    e.preventDefault()
    onFilter({
      skill: selectedSkills,
      level: selectedLevel,
      type: selectedType,
      name: searchName.toLowerCase()
    });
  };


  return (
    //Submit here in form to allow user enter + click button
    <form className="p-4 border rounded-lg shadow-md space-y-4 bg-white max-w-md"
    onSubmit= {handleSubmit}
    >
      <h2 className="text-lg font-semibold">User Filter</h2>


      {/* Name Search - <SearchBar/> here */}
      <SearchBar value={searchName} onChange={setSearchName} />
     
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
              {category.name}
            </button>
            {/* Nested Skill List */}
            {selectedCategoryId === category.id && (
              <ul className="ml-4 mt-1 space-y-1">
                {category.skills.map(skill => (
                  <li key={skill}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="skill"
                        value={skill}
                        checked={selectedSkills.includes(skill)} // checked if skill is in selectedSkills
                        onChange={() => toggleSkillSelection(skill)} // toggle skill selection
                      />
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
      <div>
        <label className="block font-medium mb-1">Skill Level</label>
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
      <div>
        <label className="block font-medium mb-1">Skill Type</label>
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
    </form>
  );
};


export default FilterSkill;



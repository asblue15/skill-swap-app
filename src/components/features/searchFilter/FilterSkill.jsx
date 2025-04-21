//dropdown filter for Skill && Skill type (want to learn | can teach) && Skill level
import { useState, useEffect } from 'react';
// for the redline ^^
const FilterSkill = () => {
// Filter states
const [mockData, setMockData] = useState({})
const [skill, setSkill] = useState('')
const [type, setType] = useState('all')
const [level, setLevel] = useState('') 

//Derived states
const [skillOptions, setSkillOptions] = useState([]);
const levelOptions = ['beginner', 'intermediate', 'advanced'];
const [filteredUsers, setFilteredUsers] = useState([]);

// useEffect to populate skill options on mount
useEffect(() => {
    const skills = new Set();

    const fetchMockData = async () => {
      try {
        const res = await fetch('/data/mockData.json')
        const data = await res.json();
        setMockData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchMockData()

    mockData?.users.forEach(user => {
        user.canTeach.forEach(s => skills.add(s.skill))
        user.wantsToLearn.forEach(s => skills.add(s.skill))
    });
    setSkillOptions([...skills]);
},[])
console.log({mockData})

 // Filter users based on skill/type/level selection
 useEffect(() => {
    const result = mockData?.users.filter(user => {
      const matches = [];

      if (type === 'canTeach' || type === 'all') {
        matches.push(
          user.canTeach.some(
            s =>
              (!skill || s.skill === skill) &&
              (!level || s.level === level)
          )
        );
      }

      if (type === 'wantsToLearn' || type === 'all') {
        matches.push(
          user.wantsToLearn.some(
            s =>
              (!skill || s.skill === skill) &&
              (!level || s.level === level)
          )
        );
      }

      return matches.includes(true);
    });

    setFilteredUsers(result);
  }, [skill, type, level]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Find Users by Skill</h2>

    {/* Filter Controls */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      {/* Skill Dropdown */}
      <select
        value={skill}
        onChange={e => setSkill(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Skills</option>
        {skillOptions.map(skill => (
          <option key={skill} value={skill}>
            {skill}
          </option>
        ))}
      </select>

      {/* Type Dropdown */}
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="all">Teach & Learn</option>
        <option value="canTeach">Can Teach</option>
        <option value="wantsToLearn">Wants to Learn</option>
      </select>

      {/* Level Dropdown */}
      <select
        value={level}
        onChange={e => setLevel(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Any Level</option>
        {levelOptions.map(level => (
          <option key={level} value={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
      </select>
    </div>

    {/* Filtered Users Display */}
    <div>
      {filteredUsers.length > 0 ? (
        filteredUsers.map(user => (
          <div key={user.id} className="border p-4 rounded mb-3 shadow-sm">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm">
              <strong>Can Teach:</strong>{' '}
              {user.canTeach.map(s => `${s.skill} (${s.level})`).join(', ') || 'None'}
            </p>
            <p className="text-sm">
              <strong>Wants to Learn:</strong>{' '}
              {user.wantsToLearn.map(s => `${s.skill} (${s.level})`).join(', ') || 'None'}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center mt-6">No users found with current filters.</p>
      )}
    </div>
  </div>
  )
}

export default FilterSkill
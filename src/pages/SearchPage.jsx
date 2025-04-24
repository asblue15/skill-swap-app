import { FilterSkill, SearchBar } from '../components/features/searchFilter';
import { useState } from 'react';
import UserCard from '../components/shared/UserCard'
const data = {
  "categories": [
    {
      "id": "cat1",
      "name": "Programming",
      "skills": ["JavaScript", "Python", "Java"]
    },
    {
      "id": "cat2",
      "name": "Design",
      "skills": ["UI/UX", "Graphic Design", "Figma"]
    },
    {
      "id": "cat3",
      "name": "Marketing",
      "skills": ["SEO", "Social Media", "Email Marketing"]
    }
  ],
  "users": [
    {
      "id": "u1",
      "name": "Alice",
      "email": "alice@example.com",
      "profilePicture": "/images/profiles/alice.jpg",
      "bio": "Passionate about web development and design. I love creating beautiful and functional web applications.",
      "facebook": "https://facebook.com/alice",
      "instagram": "https://instagram.com/alice",
      "x": "https://x.com/alice",
      "canTeach": [
        { "skill": "JavaScript", "level": "advanced" },
        { "skill": "UI/UX", "level": "intermediate" }
      ],
      "wantsToLearn": [
        { "skill": "Python", "level": "beginner" },
        { "skill": "SEO", "level": "beginner" }
      ],
      "connections": ["u2"],
      "requestSent": ["u3"],
      "requestReceived": ["u2"],
      "notifications": [
        {
          "type": "match",
          "from": "u2",
          "timestamp": "2025-04-19T13:15:00Z",
          "message": "You matched with Bob!"
        }
      ]
    },
    {
      "id": "u2",
      "name": "Bob",
      "email": "bob@example.com",
      "profilePicture": "/images/profiles/bob.jpg",
      "bio": "Full-stack developer with a passion for creating robust and scalable web applications.",
      "facebook": "https://facebook.com/bob",
      "instagram": "https://instagram.com/bob",
      "x": "https://x.com/bob",
      "canTeach": [
        { "skill": "Python", "level": "advanced" },
        { "skill": "SEO", "level": "intermediate" }
      ],
      "wantsToLearn": [{ "skill": "JavaScript", "level": "beginner" }],
      "connections": ["u1"],
      "requestSent": ["u1"],
      "requestReceived": [],
      "notifications": []
    },
    {
      "id": "u3",
      "name": "Charlie",
      "email": "charlie@example.com",
      "profilePicture": "/images/profiles/charlie.jpg",
      "bio": "Graphic designer and Figma expert, focusing on creating modern, user-friendly designs.",
      "facebook": "https://facebook.com/charlie",
      "instagram": "https://instagram.com/charlie",
      "x": "https://x.com/charlie",
      "canTeach": [
        { "skill": "Figma", "level": "advanced" },
        { "skill": "Graphic Design", "level": "intermediate" }
      ],
      "wantsToLearn": [
        { "skill": "UI/UX", "level": "beginner" },
        { "skill": "JavaScript", "level": "beginner" }
      ],
      "connections": [],
      "requestSent": [],
      "requestReceived": ["u1"],
      "notifications": []
    },
    {
      "id": "u4",
      "name": "David",
      "email": "david@example.com",
      "profilePicture": "/images/profiles/david.jpg",
      "bio": "Social media expert with an eye for strategy, helping brands grow through creative marketing.",
      "facebook": "https://facebook.com/david",
      "instagram": "https://instagram.com/david",
      "x": "https://x.com/david",
      "canTeach": [{ "skill": "Social Media", "level": "expert" }],
      "wantsToLearn": [{ "skill": "Python", "level": "intermediate" }],
      "connections": ["u1"],
      "requestSent": [],
      "requestReceived": [],
      "notifications": []
    },
    {
      "id": "u5",
      "name": "Eve",
      "email": "eve@example.com",
      "profilePicture": "/images/profiles/eve.jpg",
      "bio": "Aspiring SEO specialist with a passion for improving search rankings and digital visibility.",
      "facebook": "https://facebook.com/eve",
      "instagram": "https://instagram.com/eve",
      "x": "https://x.com/eve",
      "canTeach": [],
      "wantsToLearn": [{ "skill": "SEO", "level": "beginner" }],
      "connections": [],
      "requestSent": ["u3"],
      "requestReceived": [],
      "notifications": []
    }
  ]
}

function SearchPage() {
  const users = data.users;
  const [searchName, setSearchName] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearchChange = (value) => {
    setSearchName(value);
  
    // Filter users by name
    const filteredByName = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );

    // Combine with existing filters if filters are applied
    if(value && value.length >= 3) {
      onFilter({ skill: [], level: '', type: '' });
    } else {
      setFilteredUsers(filteredByName);
    }
  };

  const onFilter = (dataObject) => {
    const { skill, level, type } = dataObject;

    setFilteredUsers(users.filter(user => {
       // Filter by name if provided
        if (searchName && !user.name.toLowerCase().includes(searchName.toLowerCase())) {
          return false;
        }
      // filter by skill and level, and type
      let skillsArray = []
      if (type) { //If there is a specific type
          skillsArray = user[type];
          if (!skillsArray) return false;
      } else { //If all types are selected
          skillsArray = [...user.canTeach, ...user.wantsToLearn];
        }

        if (level) {
        //Check if the user has both the skill and the level
        return skillsArray.some((item) =>
          skill.includes(item.skill) && item.level === level
        );
      } else if(skill.length > 0) {
        return skillsArray.some((item) =>
          skill.includes(item.skill)
        );
      }
     return true; // If no filters are applied, return all users
    }))
    console.log(filteredUsers)
        }


  return (
    <div className="p-6 pt-20 w-full min-w-full flex flex-col bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-4xl font-semibold mb-4 text-[#2F2D2E] dark:text-gray-100 text-center">Search Page</h2>
      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="w-78 bg-white dark:bg-gray-800 shadow-md h-[calc(100vh-4rem)] sticky top-16">
          <FilterSkill data={data} onFilter={onFilter} searchName={searchName} onSearchNameChange={handleSearchChange}/>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-6">
          {/* <div className="text-[#2F2D2E] dark:text-gray-100 mb-4">
            <SearchBar value={searchName} onChange={handleSearchChange} />
            {searchName && searchName.length < 3 && (
              <p className="text-red-500 text-sm mt-2">Name must be at least 3 characters long.</p>
            )}
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg font-semibold">No results found.</p>
                <p className="text-sm">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
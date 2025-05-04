import { useState, useEffect } from 'react';
import UserCard from '../components/shared/UserCard';
import Spinner from '../components/shared/Spinner';
import { getUsers, getData } from '../services/mockDataService';
import { useConnectionContext } from '../contexts/ConnectionContext';
import FilterSkill from '../components/feature/search-filter/FilterSkill';

export default function HomePage() {
  const { user: currentUser } = useConnectionContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const USERS_PER_PAGE = 6;

  const filteredUsers = users.filter((user) => user.id !== currentUser?.id);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userData = getUsers();
        setUsers(userData);
      } catch (err) {
        console.log('Error loading data: ', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = getData();
        setData(data);
      } catch (err) {
        console.log('Error loading data: ', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResetFilter = () => {
    setSearchName('');
    setUsers(data.users);
  };
  const handleSearchChange = (value) => {
    setSearchName(value);

    // Debounce the filtering logic
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (!value.trim()) {
        setUsers(data.users); // Reset to the full user list
        return;
      }

      // Filter users by name and combine with existing filters
      onFilter({ skill: [], level: '', type: '' }); // Pass empty filters for now
    }, 300); // Adjust debounce delay as needed
  };

  const onFilter = (filterObject) => {
    const { skill, level, type } = filterObject;

    // If no filters are applied and searchName is empty, reset to the full user list
    if (!skill.length && !level && !type && !searchName) {
      setUsers(data.users); // Reset to the full user list
      return;
    }

    const filterResult = data.users.filter((user) => {
      // Filter by name if provided
      if (searchName && !user.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }

      // Filter by skill, level, and type
      let skillsArray = [];
      if (type === 'Teach') {
        skillsArray = user.canTeach || [];
      } else if (type === 'Learn') {
        skillsArray = user.wantsToLearn || [];
      } else {
        skillsArray = [...(user.canTeach || []), ...(user.wantsToLearn || [])];
      }

      if (level && skill.length > 0) {
        return skillsArray.some(
          (item) => skill.includes(item.skill) && item.level.toLowerCase() === level.toLowerCase()
        );
      } else if (level) {
        return skillsArray.some((item) => item.level.toLowerCase() === level.toLowerCase());
      } else if (skill.length > 0) {
        return skillsArray.some((item) => skill.includes(item.skill));
      }

      return true; // Include user if no specific filters are applied
    });

    setUsers(filterResult);
  };

  useEffect(() => {
    if (currentPage > Math.ceil(filteredUsers.length / USERS_PER_PAGE) && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length]);

  if (loading) {
    return (
      <div className="p-4 pt-24 flex justify-center">
        <Spinner fullWidth />
      </div>
    );
  }

  if (!data.users || data.users.length === 0) {
    return (
      <div className="p-4 pt-24">
        <p>Your page is so sad. No one signs up yet.</p>
      </div>
    );
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / USERS_PER_PAGE); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col w-full p-6">
      <div className="container mx-auto px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-6 text-pink-700">Meet new people</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          <aside className="md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg p-4 h-fit md:sticky top-24">
            <FilterSkill
              data={data}
              onFilter={onFilter}
              searchName={searchName}
              onSearchNameChange={handleSearchChange}
              handleReset={handleResetFilter}
            />
          </aside>

          {/* Main content area */}
          <div className="flex-1 min-h-[500px]">
            {users.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
                <p className="text-lg font-semibold">No results found.</p>
                <p className="text-sm">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <>
                {currentUser && currentUser.connections.length === 0 && (
                  <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800">
                      You haven't connected with anyone yet! Start making friends now.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                  {currentUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {pageNumbers.length > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === number
                        ? 'bg-pink-800 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

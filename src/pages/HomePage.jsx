import { useState, useEffect } from 'react'; 
import UserCard from '../components/shared/UserCard';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [mockData, setMockData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const usersPerPage = 6;

  useEffect(() => {
    fetch('/data/mockData.json')
      .then(res => res.json())
      .then(data => {
        setMockData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  
  if (loading) {
    return (
      <div className="p-4 pt-24 flex justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!mockData.users || mockData.users.length === 0) {
    return (
      <div className="p-4 pt-24">
        <p>No users found</p>
      </div>
    );
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = mockData.users.slice(indexOfFirstUser, indexOfLastUser);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(mockData.users.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-4 pt-24">
      <h1 className="text-2xl font-bold mb-6 text-white bg-blue-700 rounded-sm px-3 py-1 
               md:text-blue-700 md:bg-transparent md:dark:text-blue-500
               hover:text-blue-800 dark:hover:text-blue-400">User List</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 rounded-md ${
              currentPage === number 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}
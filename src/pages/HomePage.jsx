import { useState, useEffect } from 'react';
import UserCard from '../components/shared/UserCard';
import Spinner from '../components/shared/Spinner';
import { getUsers } from '../services/mockDataService';
import { useConnectionContext } from '../contexts/ConnectionContext';

export default function HomePage() {
  const { user: currentUser } = useConnectionContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const usersPerPage = 6;

  const filteredUsers = users.filter((user) => user.id !== currentUser?.id);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
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
    if (currentPage > Math.ceil(filteredUsers.length / usersPerPage) && currentPage > 1) {
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

  if (!users || users.length === 0) {
    return (
      <div className="p-4 pt-24">
        <p>Your page is so sad. No one signs up yet.</p>
      </div>
    );
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="py-4 my-5">
      <h1 className="text-2xl font-bold mb-6 text-pink-700 rounded-sm px-3">Meet new people</h1>

      {currentUser && currentUser.connections.length === 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            You haven't connected with anyone yet! Start making friends now.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {pageNumbers.length > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-4 py-2 rounded-md ${
                currentPage === number ? 'bg-pink-800 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

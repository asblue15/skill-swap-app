import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Spinner from '../components/shared/Spinner';
import { updateUser, getUserById, getUserConnections } from '../services/mockDataService';
import UserForm from '../components/shared/UserForm';

export default function UserProfilePage() {
  const { user, updateUserData } = useUser();
  const { userId } = useParams();
  const [, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const nav = useNavigate();

  // Get user data based on URL param or current user
  useEffect(() => {
    setLoading(true);
    const currentProfileUser = userId ? getUserById(userId) : user;
    setProfileUser(currentProfileUser);

    if (currentProfileUser) {
      const conn = getUserConnections(currentProfileUser.id);
      setConnections(conn);

      // Add connections to profile user data
      setProfileUser((prev) => ({
        ...prev,
        connections: conn,
      }));
    }
    setLoading(false);
  }, [userId, user]);

  const handleSubmit = async (updatedUserData) => {
    setSaving(true);
    try {
      await updateUser(updatedUserData);
      updateUserData(updatedUserData);
      setIsEditing(false);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate loading
    } catch (error) {
      console.error('Cannot update profile:', error);
      alert('Cannot update profile now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const navigateToMatches = () => {
    nav('/matches');
  };

  if (loading || !profileUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner fullWidth />
      </div>
    );
  }

  const isCurrentUser = user.id === profileUser.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isCurrentUser ? 'My Profile' : `${profileUser.name}'s Profile`}
          </h1>
          {isCurrentUser && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg ${
                isEditing
                  ? 'bg-gray-500 hover:bg-gray-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        <UserForm
          userData={profileUser}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          submitButtonText="Save Changes"
          showConnections={true}
          navigateToMatches={isCurrentUser ? navigateToMatches : null}
        />
      </div>
    </div>
  );
}

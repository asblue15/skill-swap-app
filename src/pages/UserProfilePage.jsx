import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useConnectionContext } from '../contexts/ConnectionContext';

import { updateUser, getUserById, getUserConnections } from '../services/mockDataService';
import UserForm from '../components/shared/UserForm';
import ConnectionButton from '../components/shared/ConnectionButton';
import Spinner from '../components/shared/Spinner';

export default function UserProfilePage() {
  const { user, updateUserData } = useUser();
  const {
    user: currentUser,
    sendConnectionRequest,
    respondToNotification,
  } = useConnectionContext();
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

  const isConnected = currentUser?.connections?.includes(profileUser.id) || false;
  const requestSent = currentUser?.requestSent?.includes(profileUser.id) || false;
  const requestReceived = currentUser?.requestReceived?.includes(profileUser.id) || false;

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isCurrentUser ? 'My Profile' : `${profileUser.name}'s Profile`}
          </h1>
          {/* {isCurrentUser && (
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
           */}

          <div className="flex gap-4">
            {!isCurrentUser && (
              <ConnectionButton
                isConnected={isConnected}
                requestSent={requestSent}
                requestReceived={requestReceived}
                userId={profileUser.id}
                onConnect={sendConnectionRequest}
                onRespond={(userId, accepted) => respondToNotification(userId, accepted)}
              />
            )}

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

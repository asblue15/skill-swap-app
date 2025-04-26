import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useConnectionContext } from '../contexts/ConnectionContext';
import { updateUser } from '../services/mockDataService';
import UserForm from '../components/shared/UserForm';

export default function OnboardingPage() {
  const { user, updateUserData } = useUser();
  const { updateUserInList } = useConnectionContext();
  const [, setSaving] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (updatedUserData) => {
    setSaving(true);
    try {
      await updateUser(updatedUserData);

      // Update data in both contexts
      updateUserData(updatedUserData);
      updateUserInList(updatedUserData);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate loading
      nav('/matches');
    } catch (error) {
      console.error('Cannot onboard:', error);
      alert('Cannot onboard now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserForm
          userData={user}
          onSubmit={handleSubmit}
          isEditing={true}
          submitButtonText="Finish Onboarding"
          showConnections={true}
        />
      </div>
    </div>
  );
}

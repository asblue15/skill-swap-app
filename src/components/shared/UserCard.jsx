import React, { useState } from 'react';
import { useConnectionContext } from '../../contexts/ConnectionContext';
import UserModal from './UserModal';
import ConnectionButton from './ConnectionButton';

export default function UserCard({ user }) {
  const {
    user: currentUser,
    sendConnectionRequest,
    respondToNotification,
  } = useConnectionContext();
  const [showModal, setShowModal] = useState(false);

  // Check connection status
  const isConnected = currentUser.connections.includes(user.id);
  const requestSent = currentUser.requestSent.includes(user.id);
  const requestReceived = currentUser.requestReceived.includes(user.id);

  // Modal handlers
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Don't show own card
  if (user.id === currentUser.id) return null;

  return (
    <>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10 pt-5 cursor-pointer" onClick={handleOpen}>
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
            src={user.profilePicture || '/images/profiles/default.jpg'}
            alt={user.name}
          />
          <h3 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">{user.name}</h3>

          <p className="text-sm mb-3 line-clamp-2 text-gray-600 dark:text-gray-400 px-4 text-center">
            {user.bio}
          </p>

          {/* Teach and Learn Sections */}
          <div className="mt-2 w-full text-sm px-4">
            {user.canTeach.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Can teach:</h4>
                <div className="pl-5 text-gray-600 dark:text-gray-400">
                  {user.canTeach.map((item, i) => (
                    <p key={i}>
                      {item.skill} ({item.level})
                    </p>
                  ))}
                </div>
              </div>
            )}
            {user.wantsToLearn.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Wants to learn:</h4>
                <div className="pl-5 text-gray-600 dark:text-gray-400">
                  {user.wantsToLearn.map((item, i) => (
                    <p key={i}>
                      {item.skill} ({item.level})
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex mt-4 md:mt-6 gap-4">
            <ConnectionButton
              isConnected={isConnected}
              requestSent={requestSent}
              requestReceived={requestReceived}
              userId={user.id}
              onConnect={sendConnectionRequest}
              onRespond={(userId, accepted) => respondToNotification(userId, accepted)}
            />
            <a
              href={`/user/${user.id}`}
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              Visit Page
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <UserModal user={user} onClose={handleClose} />}
    </>
  );
}

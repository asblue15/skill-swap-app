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
  const isConnected = currentUser?.connections?.includes(user.id) || false;
  const requestSent = currentUser?.requestSent?.includes(user.id) || false;
  const requestReceived = currentUser?.requestReceived?.includes(user.id) || false;

  // Modal handlers
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Don't show own card
  if (!user || (currentUser && user.id === currentUser.id)) return null;

  return (
    <>
      <div className="flex flex-col h-full w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex-grow">
          <div className="flex flex-col items-center p-5 cursor-pointer" onClick={handleOpen}>
            <img
              className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
              src={user.profilePicture || '/images/profiles/default.jpg'}
              alt={user.name}
            />
            <div className="text-center">
              <h3 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
                {user.name}
              </h3>

              <p className="text-left text-sm mb-3 line-clamp-2 text-gray-600 dark:text-gray-400 px-4">
                {user.bio}
              </p>
            </div>

            {/* Teach and Learn Sections */}
            <div className="mt-2 w-full text-sm px-4">
              {user.canTeach.length > 0 && (
                <div className="flex-1">
                  <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg h-full">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-2">
                      Teaching
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {user.canTeach.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{item.skill}</span>
                          <span className="font-medium">{item.level}</span>
                        </li>
                      ))}
                      {user.canTeach.length > 3 && (
                        <li className="text-blue-600 dark:text-blue-400 text-xs">
                          + {user.canTeach.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              <div className="mt-2"></div>
              {user.wantsToLearn.length > 0 && (
                <div className="flex-1">
                  <div className="bg-green-50 dark:bg-gray-700 p-3 rounded-lg h-full">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 text-sm mb-2">
                      Learning
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {user.wantsToLearn.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{item.skill}</span>
                          <span className="font-medium">{item.level}</span>
                        </li>
                      ))}
                      {user.wantsToLearn.length > 3 && (
                        <li className="text-green-600 dark:text-green-400 text-xs">
                          + {user.wantsToLearn.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* card footer */}
        <div className="p-5 pt-3 mt-auto border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between gap-3">
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
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 "
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

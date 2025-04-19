import React, { useState } from 'react';
import UserModal from './UserModal';

export default function UserCard({ user }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <div
        onClick={handleOpen}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
      >
        <div className="flex flex-col items-center pb-10 pt-5">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={user.profilePicture}
            alt={user.name}
          />
          <h3 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">{user.name}</h3>

          {/* Teach and Learn Sections */}
          <div className="mt-4 w-full text-sm">
            {user.canTeach.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Teach:</h4>
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
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Learn:</h4>
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
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Connect
            </button>
            <a
              href={`/user/${user.id}`}
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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

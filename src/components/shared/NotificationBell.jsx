import { useState, useEffect, useRef } from 'react';
import { FaBell as Bell } from 'react-icons/fa';
import React from 'react';
import { useConnectionContext } from '../../contexts/ConnectionContext';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { user, respondToNotification, dismissNotification } = useConnectionContext();
  const notificationRef = useRef(null);

  const notifications = user?.notifications || [];

  const handleResponse = (fromUserId, accept) => {
    respondToNotification(fromUserId, accept);
    // Don't close the notification panel so user can see updates
  };

  const handleDismiss = (index) => {
    dismissNotification(index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative text-gray-950" ref={notificationRef}>
      <button onClick={() => setOpen(!open)} className="custom-button relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-lg z-50 p-3">
          <h4 className="font-bold mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((notif, idx) => (
              <div key={idx} className="border-b border-gray-400 pb-3 mb-3 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <span className="text-xs text-gray-500 ">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {notif.type === 'connection' ? (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleResponse(notif.from, true)}
                        className="custom-button text-sm bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(notif.from, false)}
                        className="custom-button text-sm bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDismiss(idx)}
                      className="custom-button text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

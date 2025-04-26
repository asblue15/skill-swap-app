import { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../data/mockData.json';
import { useUser as useAuthUser } from './UserContext';
import {
  handleSendConnectionRequest,
  handleConnectionResponse,
  handleDismissNotification,
} from '../services/connectionService';

const ConnectionContext = createContext();

export const useConnectionContext = () => useContext(ConnectionContext);

const STORAGE_KEY = 'skillswap_user_data';

export const ConnectionProvider = ({ children }) => {
  const { user: authUser } = useAuthUser();
  const [userList, setUserList] = useState(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return mockData.users;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState({ show: false });

  // show toast notif
  const showToast = (name, message, avatar, type = 'success') => {
    setToast({
      show: true,
      name,
      message,
      avatar: avatar || '/images/profiles/default-avt.png',
      type,
    });
  };

  const closeToast = () => {
    setToast({ show: false });
  };

  useEffect(() => {
    if (authUser) {
      const detailedUser = userList.find((u) => u.id === authUser.id);
      if (detailedUser) {
        const updateDetailedUser = {
          ...detailedUser,
          connections: detailedUser.connections || [],
          requestSent: detailedUser.requestSent || [],
          requestReceived: detailedUser.requestReceived || [],
          notifications: detailedUser.notifications || [],
        };
        setCurrentUser(updateDetailedUser);

        // check if request accepted - match indicator
        checkForAcceptanceNotifications(updateDetailedUser);
      } else {
        const newDetailedUser = {
          ...authUser,
          connections: [],
          requestSent: [],
          requestReceived: [],
          notifications: [],
        };
        setCurrentUser(newDetailedUser);
        setUserList((prevList) => [...prevList, newDetailedUser]);
      }
    } else {
      setCurrentUser(null);
    }
  }, [authUser, userList]);
  // check if sent request has been accepted when user logs in
  const checkForAcceptanceNotifications = (user) => {
    if (!user?.notifications?.length) return;

    const acceptedNotifs = user.notifications.filter(
      (n) => n.type === 'connection_accepted' && !n.toastShown
    );
    if (acceptedNotifs.length > 0) {
      const notif = acceptedNotifs[0];
      const acceptingUser = userList.find((u) => u.id === notif.from);
      if (acceptingUser) {
        showToast(
          acceptingUser.name,
          `${acceptingUser.name} accepted your request!`,
          acceptingUser.avatar,
          'success'
        );

        const updatedUser = {
          ...user,
          notifications: user.notifications.map((n) =>
            n === notif ? { ...n, toastShown: true } : n
          ),
        };
        setCurrentUser(updatedUser);
        setUserList((prevList) => prevList.map((u) => (u.id === user.id ? updatedUser : u)));
      }
    }
  };

  useEffect(() => {
    if (userList) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userList));
    }
  }, [userList]);

  const sendConnectionRequest = (targetUserId) => {
    const result = handleSendConnectionRequest(currentUser, userList, targetUserId);
    if (result.success) {
      setCurrentUser(result.updatedCurrentUser);
      setUserList(result.updatedUsers);
      return true;
    }
    return false;
  };

  const respondToNotification = (fromUserId, accept) => {
    const result = handleConnectionResponse(currentUser, userList, fromUserId, accept);
    if (result.success) {
      setCurrentUser(result.updatedCurrentUser);
      setUserList(result.updatedUsers);

      if (accept) {
        const otherUser = result.updatedUsers.find((u) => u.id === fromUserId);
        if (otherUser) {
          showToast(
            otherUser.name,
            `You are connected with ${otherUser.name}`,
            otherUser.avatar,
            'success'
          );
          const updatedOtherUser = {
            ...otherUser,
            notifications: [
              ...(otherUser.notifcations || []),
              {
                type: 'connection_accepted',
                from: currentUser.id,
                message: `${currentUser.id} accepted your request!`,
                timeStamp: new Date().ISOString(),
                toastShown: false,
              },
            ],
          };
          setUserList((prevList) =>
            prevList.map((u) => (u.id === fromUserId ? updatedOtherUser : u))
          );
        }
      }
      return {
        success: true,
        updatedUsers: result.updatedUsers,
      };
    }
    return { success: false };
  };

  const dismissNotification = (notificationIndex) => {
    const result = handleDismissNotification(currentUser, userList, notificationIndex);
    if (result.success) {
      setCurrentUser(result.updatedCurrentUser);
      setUserList(result.updatedUsers);
      return true;
    }
    return false;
  };

  const value = {
    user: currentUser,
    userList,
    sendConnectionRequest,
    respondToNotification,
    dismissNotification,
    setCurrentUser,
    toast,
    showToast,
    closeToast,
  };

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

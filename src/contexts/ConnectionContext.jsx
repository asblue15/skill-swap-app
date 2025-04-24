import React, { createContext, useContext, useState, useEffect } from 'react';
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
      return true;
    }
    return false;
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
  };

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

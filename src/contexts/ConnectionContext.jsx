import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const { user: authUser, updateUserData } = useAuthUser();
  const [userList, setUserList] = useState(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return mockData.users;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState({ show: false });

  // Use useRef to track if we're currently updating the user list to prevent loops
  const isUpdatingUserList = useRef(false);

  // Show toast notification
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

  // syncs authUser from UserContext with currentUser in ConnectionContext
  useEffect(() => {
    if (!authUser || isUpdatingUserList.current) return;

    const detailedUser = userList.find((u) => u.id === authUser.id);
    if (detailedUser) {
      // Don't update the user list here - just update currentUser
      const updateDetailedUser = {
        ...detailedUser,
        // merge specific fields from authUser that might have been changed
        // like name, skills, etc.
        name: authUser.name,
        email: authUser.email,
        profilePicture: authUser.profilePicture,
        bio: authUser.bio,
        skills: authUser.skills,
        interests: authUser.interests,
        // Keep connection data from detailedUser
        connections: detailedUser.connections || [],
        requestSent: detailedUser.requestSent || [],
        requestReceived: detailedUser.requestReceived || [],
        notifications: detailedUser.notifications || [],
      };
      setCurrentUser(updateDetailedUser);

      // Check if request accepted - match indicator
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

      // Safe update of userList without causing loops
      isUpdatingUserList.current = true;
      setUserList((prevList) => {
        const newList = [...prevList, newDetailedUser];
        setTimeout(() => {
          isUpdatingUserList.current = false;
        }, 0);
        return newList;
      });
    }
  }, [authUser]); // Remove userList from dependencies!

  // Check if sent request has been accepted when user logs in
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
          acceptingUser.profilePicture,
          'success'
        );

        const updatedUser = {
          ...user,
          notifications: user.notifications.map((n) =>
            n === notif ? { ...n, toastShown: true } : n
          ),
        };
        setCurrentUser(updatedUser);

        // Safe update of userList
        isUpdatingUserList.current = true;
        setUserList((prevList) => {
          const newList = prevList.map((u) => (u.id === user.id ? updatedUser : u));
          setTimeout(() => {
            isUpdatingUserList.current = false;
          }, 0);
          return newList;
        });
      }
    }
  };

  // Save userList to localStorage whenever it changes
  useEffect(() => {
    if (userList) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userList));
    }
  }, [userList]);

  const sendConnectionRequest = (targetUserId) => {
    const result = handleSendConnectionRequest(currentUser, userList, targetUserId);
    if (result.success) {
      setCurrentUser(result.updatedCurrentUser);
      updateUserData(result.updatedCurrentUser);
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
      updateUserData(result.updatedCurrentUser);

      if (accept) {
        const otherUser = result.updatedUsers.find((u) => u.id === fromUserId);
        if (otherUser) {
          showToast(
            otherUser.name,
            `You are connected with ${otherUser.name}`,
            otherUser.profilePicture,
            'success'
          );
          const updatedOtherUser = {
            ...otherUser,
            notifications: [
              ...(otherUser.notifications || []),
              {
                type: 'connection_accepted',
                from: currentUser.id,
                message: `${currentUser.name} accepted your request!`,
                timeStamp: new Date().toISOString(),
                toastShown: false,
              },
            ],
          };

          isUpdatingUserList.current = true;
          setUserList((prevList) => {
            const newList = prevList.map((u) => (u.id === fromUserId ? updatedOtherUser : u));
            setTimeout(() => {
              isUpdatingUserList.current = false;
            }, 0);
            return newList;
          });
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
      updateUserData(result.updatedCurrentUser);
      setUserList(result.updatedUsers);
      return true;
    }
    return false;
  };

  // Add a new function to update user profile data in ConnectionContext
  const updateUserInList = (updatedUserData) => {
    if (!updatedUserData || !updatedUserData.id) return false;

    // Find the user in the list
    const userIndex = userList.findIndex((u) => u.id === updatedUserData.id);

    // Get the existing user with all connection data
    const existingUser =
      userIndex !== -1
        ? userList[userIndex]
        : {
            connections: [],
            requestSent: [],
            requestReceived: [],
            notifications: [],
          };

    // Create updated user with merged data
    const mergedUser = {
      ...existingUser,
      ...updatedUserData,
      // Preserve connection data
      connections: existingUser.connections || [],
      requestSent: existingUser.requestSent || [],
      requestReceived: existingUser.requestReceived || [],
      notifications: existingUser.notifications || [],
    };

    // Update the user list
    isUpdatingUserList.current = true;
    if (userIndex !== -1) {
      // Update existing user
      setUserList((prevList) => {
        const newList = [...prevList];
        newList[userIndex] = mergedUser;
        setTimeout(() => {
          isUpdatingUserList.current = false;
        }, 0);
        return newList;
      });
    } else {
      // Add new user
      setUserList((prevList) => {
        const newList = [...prevList, mergedUser];
        setTimeout(() => {
          isUpdatingUserList.current = false;
        }, 0);
        return newList;
      });
    }

    // If this is the current user, update that too
    if (currentUser && currentUser.id === updatedUserData.id) {
      setCurrentUser(mergedUser);
    }

    return true;
  };

  const value = {
    user: currentUser,
    userList,
    sendConnectionRequest,
    respondToNotification,
    dismissNotification,
    setCurrentUser,
    updateUserInList,
    toast,
    showToast,
    closeToast,
  };

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

export const handleSendConnectionRequest = (currentUser, userList, targetUserId) => {
  if (!currentUser) return { success: false };

  const updatedCurrentUser = {
    ...currentUser,
    requestSent: [...currentUser.requestSent, targetUserId],
  };

  const updatedUsers = userList.map((user) => {
    if (user.id === targetUserId) {
      return {
        ...user,
        requestReceived: [...user.requestReceived, currentUser.id],
        notifications: [
          ...user.notifications,
          {
            type: 'connection',
            from: currentUser.id,
            timestamp: new Date().toISOString(),
            message: `${currentUser.name} wants to connect with you!`,
          },
        ],
      };
    }
    return user;
  });

  const finalUsers = updatedUsers.map((user) =>
    user.id === currentUser.id ? updatedCurrentUser : user
  );

  return {
    success: true,
    updatedCurrentUser,
    updatedUsers: finalUsers,
  };
};

export const handleConnectionResponse = (currentUser, userList, fromUserId, accept) => {
  if (!currentUser) return { success: false };

  const updatedNotifications = currentUser.notifications.filter(
    (notif) => !(notif.from === fromUserId && notif.type === 'connection')
  );

  let updatedCurrentUser = {
    ...currentUser,
    notifications: updatedNotifications,
    requestReceived: currentUser.requestReceived.filter((id) => id !== fromUserId),
  };

  let updatedUsers = userList.map((user) => {
    if (user.id === currentUser.id) return updatedCurrentUser;
    return user;
  });

  if (accept) {
    updatedCurrentUser = {
      ...updatedCurrentUser,
      connections: [...new Set([...updatedCurrentUser.connections, fromUserId])],
    };

    updatedUsers = updatedUsers.map((user) => {
      if (user.id === fromUserId) {
        return {
          ...user,
          connections: [...new Set([...user.connections, currentUser.id])],
          requestSent: user.requestSent.filter((id) => id !== currentUser.id),
          notifications: [
            ...user.notifications,
            {
              type: 'accepted',
              from: currentUser.id,
              timestamp: new Date().toISOString(),
              message: `${currentUser.name} has accepted your connection request!`,
            },
          ],
        };
      }
      return user;
    });
  } else {
    updatedUsers = updatedUsers.map((user) => {
      if (user.id === fromUserId) {
        return {
          ...user,
          requestSent: user.requestSent.filter((id) => id !== currentUser.id),
        };
      }
      return user;
    });
  }

  updatedUsers = updatedUsers.map((user) =>
    user.id === currentUser.id ? updatedCurrentUser : user
  );

  return {
    success: true,
    updatedCurrentUser,
    updatedUsers,
  };
};

export const handleDismissNotification = (currentUser, userList, notificationIndex) => {
  if (!currentUser) return { success: false };

  const updatedNotifications = [...currentUser.notifications];
  updatedNotifications.splice(notificationIndex, 1);

  const updatedUser = {
    ...currentUser,
    notifications: updatedNotifications,
  };

  const updatedUsers = userList.map((user) => (user.id === currentUser.id ? updatedUser : user));

  return {
    success: true,
    updatedCurrentUser: updatedUser,
    updatedUsers,
  };
};

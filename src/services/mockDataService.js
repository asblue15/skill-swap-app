import initialData from '../data/mockData.json';
const STORAGE_KEY = 'wc725';

const initializeData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const getData = () => {
  return initializeData();
};

export const getUsers = () => {
  return getData().users;
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find((user) => user.id === userId);
};

export const getUserByName = (userName) => {
  const users = getUsers();
  if (!userName) return users;

  const caseUserName = userName.toLowerCase();
  return users.filter((user) => user.name.toLowerCase().includes(caseUserName));
};

export const addUser = (newUser) => {
  const data = getData();
  data.users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return newUser;
};

export const updateUser = (updatedUser) => {
  const data = getData();
  const index = data.users.findIndex((user) => user.id === updatedUser.id);

  if (index !== -1) {
    data.users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return updatedUser;
  }
  return null;
};

export const deleteUser = (userId) => {
  const data = getData();
  const index = data.users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    const deletedUser = data.users[index];
    data.users.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return deletedUser;
  }
  return null;
};

export const getCategories = () => {
  return getData().categories;
};

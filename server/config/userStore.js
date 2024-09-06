// config/userStore.js
const userStore = new Map(); // Using a Map for user storage

const setUser = (userId, userData) => {
  userStore.set(userId, userData);
};

const getUser = (userId) => {
  return userStore.get(userId);
};

const removeUser = (userId) => {
  userStore.delete(userId);
};

module.exports = {
  setUser,
  getUser,
  removeUser,
};

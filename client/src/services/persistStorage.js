export const saveUserData = userData => localStorage.setItem('user', userData);

export const getUserData = () => localStorage.getItem('user');

export const clearStorage = () => localStorage.clear();

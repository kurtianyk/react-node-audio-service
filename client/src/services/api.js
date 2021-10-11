import apisauce from 'apisauce';

import AuthService from './auth';

const jwt = new AuthService();

const SITE_URL = process.env.SITE_URL || document.location.origin;
const api = apisauce.create({
  baseURL: SITE_URL,
  timeout: 10000,

  headers: {
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const setToken = () => {
  if (jwt.loggedIn()) {
    api.setHeader('authorization', `Bearer ${jwt.getToken()}`);
  }
}

const signInUser = (email, password) => api.post(`/api/v1/auth/signin`, { email, password });
const signUpUser = (name, email, password) => api.post(`/api/v1/auth/signup`, { name, email, password });

export default {
    signInUser,
    signUpUser,
    setToken
};

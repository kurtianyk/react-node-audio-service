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

const uploadFile = (name, email, password) => api.post(`/api/v1/audio/upload`, { name, email, password });

const getAllVouchers = () => api.get('/api/v1/voucher-management/all');
const addVoucher = (body) => api.post(`/api/v1/voucher-management/add`, body);
const editVoucher = (body) => api.put(`/api/v1/voucher-management/update`, body);
const deleteVoucher = (id) => api.delete(`/api/v1/voucher-management/delete/${id}`);

export default {
    signInUser,
    signUpUser,
    addVoucher,
    editVoucher,
    deleteVoucher,
    getAllVouchers,
    setToken
};

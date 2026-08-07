import api from './api';

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfileApi = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const changePasswordApi = async (passwords) => {
  const response = await api.put('/auth/change-password', passwords);
  return response.data;
};

import api from './api';

export const createComplaintApi = async (formData) => {
  const isMultipart = formData instanceof FormData;
  const config = isMultipart
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  const response = await api.post('/complaints', formData, config);
  return response.data;
};

export const getComplaintsApi = async (params = {}) => {
  const response = await api.get('/complaints', { params });
  return response.data;
};

export const getComplaintByIdApi = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

export const updateComplaintStatusApi = async (id, updateData) => {
  const isMultipart = updateData instanceof FormData;
  const config = isMultipart
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  const response = await api.put(`/complaints/${id}`, updateData, config);
  return response.data;
};

export const addCitizenFeedbackApi = async (id, feedbackData) => {
  const response = await api.post(`/complaints/${id}/feedback`, feedbackData);
  return response.data;
};

export const deleteComplaintApi = async (id) => {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};

export const getDepartmentsApi = async () => {
  const response = await api.get('/departments');
  return response.data;
};

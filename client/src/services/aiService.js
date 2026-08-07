import api from './api';

export const analyzeComplaintApi = async (title, description) => {
  const response = await api.post('/ai/analyzeComplaint', { title, description });
  return response.data;
};

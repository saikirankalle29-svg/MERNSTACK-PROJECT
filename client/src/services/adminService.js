import api from './api';

export const getAdminStatsApi = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getUsersApi = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserRoleApi = async (userId, data) => {
  const response = await api.put(`/admin/users/${userId}`, data);
  return response.data;
};

export const createDepartmentApi = async (deptData) => {
  const response = await api.post('/departments', deptData);
  return response.data;
};

export const updateDepartmentApi = async (deptId, deptData) => {
  const response = await api.put(`/departments/${deptId}`, deptData);
  return response.data;
};

export const deleteDepartmentApi = async (deptId) => {
  const response = await api.delete(`/departments/${deptId}`);
  return response.data;
};

export const getNotificationsApi = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationReadApi = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

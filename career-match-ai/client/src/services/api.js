import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me')
};

// Student
export const studentAPI = {
  getProfile: () => API.get('/students/profile'),
  updateProfile: (data) => API.put('/students/profile', data),
  uploadResume: (formData) => API.post('/students/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteResume: () => API.delete('/students/resume'),
  getRecommendations: () => API.get('/students/recommendations'),
  toggleSavedJob: (jobId) => API.post(`/students/saved-jobs/${jobId}`),
  getSavedJobs: () => API.get('/students/saved-jobs')
};

// Jobs
export const jobAPI = {
  getJobs: (params) => API.get('/jobs', { params }),
  getJob: (id) => API.get(`/jobs/${id}`),
  createJob: (data) => API.post('/jobs', data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/jobs/${id}`)
};

// Applications
export const applicationAPI = {
  apply: (data) => API.post('/applications', data),
  getMyApplications: () => API.get('/applications/my'),
  getApplication: (id) => API.get(`/applications/${id}`),
  updateStatus: (id, data) => API.patch(`/applications/${id}/status`, data),
  getJobApplicants: (jobId) => API.get(`/applications/job/${jobId}`)
};

// AI
export const aiAPI = {
  getMatchScore: (data) => API.post('/ai/match', data),
  getRecommendations: () => API.post('/ai/recommendations')
};

// Recruiter
export const recruiterAPI = {
  getProfile: () => API.get('/recruiters/profile'),
  updateProfile: (data) => API.put('/recruiters/profile', data),
  getMyJobs: () => API.get('/recruiters/jobs'),
  getDashboard: () => API.get('/recruiters/dashboard'),
  getJobApplicants: (jobId) => API.get(`/recruiters/jobs/${jobId}/applicants`)
};

// Admin
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  getJobs: (params) => API.get('/admin/jobs', { params }),
  getApplications: (params) => API.get('/admin/applications', { params }),
  toggleUserStatus: (id) => API.patch(`/admin/users/${id}/toggle`)
};

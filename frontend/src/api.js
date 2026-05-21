const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const apiClient = async (endpoint, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const api = {
  // Auth endpoints
  login: (studentId, password) => 
    apiClient('/auth/login', { method: 'POST', body: JSON.stringify({ studentId, password }) }),
  
  register: (userData) => 
    apiClient('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  
  getMe: () => apiClient('/auth/me'),
  
  updatePassword: (currentPassword, newPassword) => 
    apiClient('/auth/updatepassword', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Student endpoints
  getDashboard: () => apiClient('/dashboard/me'),
  getMyGrades: (params) => apiClient(`/grades/me${params ? `?${new URLSearchParams(params)}` : ''}`),
  getMySchedule: (params) => apiClient(`/schedule/me${params ? `?${new URLSearchParams(params)}` : ''}`),
  getSubjects: () => apiClient('/subjects'),
  getAnnouncements: (params) => apiClient(`/announcements${params ? `?${new URLSearchParams(params)}` : ''}`),
  
  // Enrollment — fixed: was '/enrollment', server uses '/api/enrollments'
  getMyEnrollments: (params) => apiClient(`/enrollments${params ? `?${new URLSearchParams(params)}` : ''}`),
  enrollSubject: (subjectId, semester, academicYear) => 
    apiClient('/enrollments', { method: 'POST', body: JSON.stringify({ subjectId, semester, academicYear }) }),
  dropSubject: (enrollmentId) => 
    apiClient(`/enrollments/${enrollmentId}/drop`, { method: 'PUT' }),

  // Faculty endpoints
  getFacultyDashboard: () => apiClient('/faculty/dashboard'),
  getFacultySubjects: () => apiClient('/faculty/subjects'),
  getSubjectStudents: (subjectId) => apiClient(`/faculty/subjects/${subjectId}/students`),
  updateGrade: (gradeId, data) => 
    apiClient(`/faculty/grades/${gradeId}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Admin endpoints
  getAdminDashboard: () => apiClient('/admin/dashboard'),
  getStudents: () => apiClient('/students'),           // fixed: was '/admin/students'
  getEnrollmentReport: (params) => apiClient(`/admin/reports/enrollment${params ? `?${new URLSearchParams(params)}` : ''}`),
  getGradesReport: (params) => apiClient(`/admin/reports/grades${params ? `?${new URLSearchParams(params)}` : ''}`),
  createUser: (userData) => apiClient('/admin/users', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: (id, userData) => apiClient(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  changeUserRole: (id, role) => apiClient(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

  // Subject management (admin)
  createSubject: (subjectData) => apiClient('/subjects', { method: 'POST', body: JSON.stringify(subjectData) }),
  updateSubject: (id, subjectData) => apiClient(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(subjectData) }),
  deleteSubject: (id) => apiClient(`/subjects/${id}`, { method: 'DELETE' }),

  // Announcements (admin)
  createAnnouncement: (data) => apiClient('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  updateAnnouncement: (id, data) => apiClient(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiClient(`/announcements/${id}`, { method: 'DELETE' }),

  // Settings
  getProfile: () => apiClient('/settings/profile'),
  updateProfile: (data) => apiClient('/settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (currentPassword, newPassword, confirmPassword) => 
    apiClient('/settings/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword, confirmPassword }) }),
  getNotificationPrefs: () => apiClient('/settings/notifications'),
  updateNotificationPrefs: (data) => apiClient('/settings/notifications', { method: 'PUT', body: JSON.stringify(data) }),
  getThemePrefs: () => apiClient('/settings/theme'),
  updateThemePrefs: (data) => apiClient('/settings/theme', { method: 'PUT', body: JSON.stringify(data) }),

  getFacultyList: () => apiClient('/admin/faculty'),

  getSubjectGrades: (subjectId) => apiClient(`/grades/subject/${subjectId}`),
  postGrade: (id, data) => apiClient(`/grades/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
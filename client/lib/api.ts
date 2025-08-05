const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('cleancycle_token');

// API client with error handling
export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  },

  // Authentication endpoints
  auth: {
    register: (userData: { name: string; email: string; password: string; role?: string }) =>
      apiClient.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    login: (credentials: { email: string; password: string }) =>
      apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    logout: () =>
      apiClient.request('/auth/logout', {
        method: 'POST',
      }),

    getMe: () => apiClient.request('/auth/me'),

    updateProfile: (data: any) =>
      apiClient.request('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Schedule endpoints
  schedules: {
    getAll: (filters?: any) => {
      const params = new URLSearchParams(filters).toString();
      return apiClient.request(`/schedules?${params}`);
    },

    create: (scheduleData: any) =>
      apiClient.request('/schedules', {
        method: 'POST',
        body: JSON.stringify(scheduleData),
      }),

    update: (id: string, scheduleData: any) =>
      apiClient.request(`/schedules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(scheduleData),
      }),

    delete: (id: string) =>
      apiClient.request(`/schedules/${id}`, {
        method: 'DELETE',
      }),

    getStats: () => apiClient.request('/schedules/stats'),
  },

  // Issue endpoints
  issues: {
    getAll: (filters?: any) => {
      const params = new URLSearchParams(filters).toString();
      return apiClient.request(`/issues?${params}`);
    },

    create: (issueData: any) =>
      apiClient.request('/issues', {
        method: 'POST',
        body: JSON.stringify(issueData),
      }),

    update: (id: string, issueData: any) =>
      apiClient.request(`/issues/${id}`, {
        method: 'PUT',
        body: JSON.stringify(issueData),
      }),

    delete: (id: string) =>
      apiClient.request(`/issues/${id}`, {
        method: 'DELETE',
      }),

    addComment: (id: string, comment: any) =>
      apiClient.request(`/issues/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment),
      }),
  },

  // Notification endpoints
  notifications: {
    getAll: () => apiClient.request('/notifications'),

    create: (notificationData: any) =>
      apiClient.request('/notifications', {
        method: 'POST',
        body: JSON.stringify(notificationData),
      }),

    markAsRead: (id: string) =>
      apiClient.request(`/notifications/${id}/read`, {
        method: 'POST',
      }),

    delete: (id: string) =>
      apiClient.request(`/notifications/${id}`, {
        method: 'DELETE',
      }),
  },

  // Analytics endpoints
  analytics: {
    getOverview: () => apiClient.request('/analytics/overview'),
    getWasteTypes: () => apiClient.request('/analytics/waste-types'),
    getPerformance: () => apiClient.request('/analytics/performance'),
    getEnvironmental: () => apiClient.request('/analytics/environmental'),
    getCosts: () => apiClient.request('/analytics/costs'),
  },

  // User endpoints
  users: {
    getAll: () => apiClient.request('/users'),
    getStats: () => apiClient.request('/users/stats'),
    update: (id: string, userData: any) =>
      apiClient.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
    delete: (id: string) =>
      apiClient.request(`/users/${id}`, {
        method: 'DELETE',
      }),
  },
};

export default apiClient;

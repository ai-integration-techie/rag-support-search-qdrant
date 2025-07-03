import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Search API
export const searchAPI = {
  search: async (params) => {
    return api.post('/search', params);
  },

  searchGet: async (params) => {
    return api.get('/search', { params });
  },

  getSuggestions: async () => {
    return api.get('/suggestions');
  },

  getStats: async () => {
    return api.get('/stats');
  },
};

// Upload API
export const uploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    return api.post('/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUploadStatus: async () => {
    return api.get('/upload-status');
  },
};

// Documents API
export const documentsAPI = {
  listDocuments: async (params = {}) => {
    return api.get('/documents', { params });
  },

  getDocument: async (id) => {
    return api.get(`/documents/${id}`);
  },

  deleteDocument: async (id) => {
    return api.delete(`/documents/${id}`);
  },

  getDocumentChunks: async (id) => {
    return api.get(`/documents/${id}/chunks`);
  },

  getCategories: async () => {
    return api.get('/categories');
  },

  getDocumentTypes: async () => {
    return api.get('/document-types');
  },

  getStats: async () => {
    return api.get('/stats');
  },

  clearAllDocuments: async () => {
    return api.post('/documents/clear');
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return api.get('/health');
  },
};

export default api; 
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Token management
export const tokenStorage = {
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },
  removeToken: (): void => {
    localStorage.removeItem('token');
  }
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'An error occurred');
    }

    if (!response.ok) {
      // Handle 403 Forbidden (admin access required)
      if (response.status === 403) {
        // Clear invalid tokens and redirect
        tokenStorage.removeToken();
        roleStorage.removeRole();
        throw new Error('Admin access required. You do not have permission to access this resource.');
      }
      // Handle 401 Unauthorized
      if (response.status === 401) {
        tokenStorage.removeToken();
        roleStorage.removeRole();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// User role storage
export const roleStorage = {
  getRole: (): string | null => {
    return localStorage.getItem('role');
  },
  setRole: (role: string): void => {
    localStorage.setItem('role', role);
  },
  removeRole: (): void => {
    localStorage.removeItem('role');
  }
};

// Auth API functions
type ApiResponse<T> = {
  success: boolean;
  data: T;
  token?: string;
  message?: string;
};

export type Certification = {
  _id: string;
  title: string;
  imageUrl: string;
  category?: string;
  description?: string;
  createdAt: string;
};

export type GalleryItem = {
  _id: string;
  title: string;
  imageUrl: string;
  category?: string;
  description?: string;
  createdAt: string;
};

export type Guard = {
  _id: string;
  id: string;
  name: string;
  location: string;
  shift: 'Day' | 'Night' | 'Flex';
  contact: string;
  status: 'Active' | 'On Leave';
  image?: string;
};

export const authAPI = {
  // User authentication
  register: async (name: string, email: string, password: string) => {
    const response = await apiRequest<{
      success: boolean;
      token: string;
      data: { id: string; name: string; email: string; role: string };
    }>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (response.data.role) {
      roleStorage.setRole(response.data.role);
    }
    return response;
  },

  userLogin: async (email: string, password: string) => {
    const response = await apiRequest<{
      success: boolean;
      token: string;
      data: { id: string; name: string; email: string; role: string };
    }>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data.role) {
      roleStorage.setRole(response.data.role);
    }
    return response;
  },

  userGetMe: async () => {
    const response = await apiRequest<{
      success: boolean;
      data: { id: string; name: string; email: string; role: string };
    }>('/users/me', {
      method: 'GET',
    });
    return response;
  },

  // Admin authentication
  adminLogin: async (email: string, password: string) => {
    const response = await apiRequest<{
      success: boolean;
      token: string;
      data: { id: string; name: string; email: string; role: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data.role) {
      roleStorage.setRole(response.data.role);
    }
    return response;
  },

  adminGetMe: async () => {
    const response = await apiRequest<{
      success: boolean;
      data: { id: string; name: string; email: string; role: string };
    }>('/auth/me', {
      method: 'GET',
    });
    return response;
  },

  // Get current user/admin (works for both)
  getMe: async () => {
    const role = roleStorage.getRole();
    if (role === 'admin') {
      return authAPI.adminGetMe();
    } else {
      return authAPI.userGetMe();
    }
  },

  logout: () => {
    tokenStorage.removeToken();
    roleStorage.removeRole();
  }
};

export const certificationAPI = {
  getAll: async () =>
    apiRequest<ApiResponse<Certification[]>>('/certifications', {
      method: 'GET',
    }),
  create: async (payload: {
    title: string;
    imageUrl: string;
    category?: string;
    description?: string;
  }) =>
    apiRequest<ApiResponse<Certification>>('/admin/certifications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  remove: async (id: string) =>
    apiRequest<ApiResponse<{}>>(`/admin/certifications/${id}`, {
      method: 'DELETE',
    }),
  update: async (
    id: string,
    payload: {
      title: string;
      imageUrl: string;
      category?: string;
      description?: string;
    }
  ) =>
    apiRequest<ApiResponse<Certification>>(`/admin/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export const galleryAPI = {
  getAll: async () =>
    apiRequest<ApiResponse<GalleryItem[]>>('/gallery', {
      method: 'GET',
    }),
  create: async (payload: {
    title: string;
    imageUrl: string;
    category?: string;
    description?: string;
  }) =>
    apiRequest<ApiResponse<GalleryItem>>('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  remove: async (id: string) =>
    apiRequest<ApiResponse<{}>>(`/admin/gallery/${id}`, {
      method: 'DELETE',
    }),
  update: async (
    id: string,
    payload: {
      title: string;
      imageUrl: string;
      category?: string;
      description?: string;
    }
  ) =>
    apiRequest<ApiResponse<GalleryItem>>(`/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export const guardAPI = {
  getAll: async () =>
    apiRequest<ApiResponse<Guard[]>>('/admin/guards', {
      method: 'GET',
    }),
  create: async (payload: Omit<Guard, '_id'>) =>
    apiRequest<ApiResponse<Guard>>('/admin/guards', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: async (id: string, payload: Partial<Omit<Guard, '_id'>>) =>
    apiRequest<ApiResponse<Guard>>(`/admin/guards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: async (id: string) =>
    apiRequest<ApiResponse<{}>>(`/admin/guards/${id}`, {
      method: 'DELETE',
    }),
};

export type DashboardStats = {
  totalGuards: { value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral' };
  activeGuards: { value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral' };
  totalApplications: { value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral' };
  totalEnquiries: { value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral' };
  totalCertifications: { value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral' };
  totalGalleryItems: { value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral' };
};

export type Application = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  resume: string;
  status?: 'Pending' | 'Reviewed' | 'Interviewed' | 'Selected' | 'Rejected';
  notes?: string;
  submittedAt: string;
};

export type Training = {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  duration: string;
  location: string;
  participants?: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
};

export type Customer = {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  serviceType: string;
  contractStartDate: string;
  contractEndDate?: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Terminated';
  notes?: string;
  createdAt: string;
};

export const adminAPI = {
  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) =>
    apiRequest<ApiResponse<{}>>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getDashboardStats: async () =>
    apiRequest<ApiResponse<DashboardStats>>('/admin/dashboard/stats', {
      method: 'GET',
    }),
};

export const applicationAPI = {
  getAll: async () =>
    apiRequest<ApiResponse<Application[]>>('/admin/applications', {
      method: 'GET',
    }),
  update: async (id: string, payload: { status?: string; notes?: string }) =>
    apiRequest<ApiResponse<Application>>(`/admin/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: async (id: string) =>
    apiRequest<ApiResponse<{}>>(`/admin/applications/${id}`, {
      method: 'DELETE',
    }),
};

export const trainingAPI = {
  getAll: async () =>
    apiRequest<ApiResponse<Training[]>>('/admin/trainings', {
      method: 'GET',
    }),
  create: async (payload: Omit<Training, '_id' | 'createdAt'>) =>
    apiRequest<ApiResponse<Training>>('/admin/trainings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: async (id: string, payload: Partial<Omit<Training, '_id' | 'createdAt'>>) =>
    apiRequest<ApiResponse<Training>>(`/admin/trainings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: async (id: string) =>
    apiRequest<ApiResponse<{}>>(`/admin/trainings/${id}`, {
      method: 'DELETE',
    }),
};

export const customerAPI = {
  getAll: async () =>
    apiRequest<ApiResponse<Customer[]>>('/admin/customers', {
      method: 'GET',
    }),
  create: async (payload: Omit<Customer, '_id' | 'createdAt'>) =>
    apiRequest<ApiResponse<Customer>>('/admin/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: async (id: string, payload: Partial<Omit<Customer, '_id' | 'createdAt'>>) =>
    apiRequest<ApiResponse<Customer>>(`/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: async (id: string) =>
    apiRequest<ApiResponse<{}>>(`/admin/customers/${id}`, {
      method: 'DELETE',
    }),
};

export type Enquiry = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
  subject?: string;
};

export const enquiryAPI = {
  getAll: async () =>
    apiRequest<ApiResponse<Enquiry[]>>('/admin/enquiries', {
      method: 'GET',
    }),
  remove: async (id: string) =>
    apiRequest<ApiResponse<{}>>(`/admin/enquiries/${id}`, {
      method: 'DELETE',
    }),
};

export const contactAPI = {
  submitEnquiry: async (payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) =>
    apiRequest<ApiResponse<Enquiry>>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};


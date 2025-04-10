
import { ApiResponse } from '@/types/ApiResponse';
import { FamilyTree } from '@/types/FamilyTree';
import { FamilyMember } from '@/types/FamilyMember';
import { User } from '@/types/User';

// Base API URL - would be set from environment variables in a real app
const API_URL = 'http://localhost:5000/api';

// Helper to get the auth token from local storage
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  return user ? `Bearer ${JSON.parse(user).token}` : '';
};

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    // Add auth token to headers if available
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };
    
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || 'An error occurred',
        status: 'error',
      };
    }

    return {
      data: data.data,
      status: 'success',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 'error',
    };
  }
}

// User API functions
export const userApi = {
  login: (email: string, password: string) => 
    fetchApi<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (name: string, email: string, password: string) =>
    fetchApi<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  getCurrentUser: () => fetchApi<User>('/auth/me'),
  
  updateProfile: (userData: Partial<User>) =>
    fetchApi<User>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),
};

// Family Tree API functions
export const familyTreeApi = {
  getTrees: () => fetchApi<FamilyTree[]>('/trees'),
  
  getTreeById: (id: string) => fetchApi<FamilyTree>(`/trees/${id}`),
  
  createTree: (tree: Omit<FamilyTree, 'id' | 'createdAt' | 'updatedAt'>) =>
    fetchApi<FamilyTree>('/trees', {
      method: 'POST',
      body: JSON.stringify(tree),
    }),
  
  updateTree: (id: string, tree: Partial<FamilyTree>) =>
    fetchApi<FamilyTree>(`/trees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(tree),
    }),
  
  deleteTree: (id: string) =>
    fetchApi<void>(`/trees/${id}`, {
      method: 'DELETE',
    }),
};

// Family Member API functions
export const familyMemberApi = {
  getMembersByTreeId: (treeId: string) =>
    fetchApi<FamilyMember[]>(`/trees/${treeId}/members`),
  
  createMember: (member: Omit<FamilyMember, 'id'>) =>
    fetchApi<FamilyMember>(`/trees/${member.treeId}/members`, {
      method: 'POST',
      body: JSON.stringify(member),
    }),
  
  updateMember: (id: string, member: Partial<FamilyMember>) =>
    fetchApi<FamilyMember>(`/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(member),
    }),
  
  deleteMember: (id: string) =>
    fetchApi<void>(`/members/${id}`, {
      method: 'DELETE',
    }),
};


export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

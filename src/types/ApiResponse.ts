
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

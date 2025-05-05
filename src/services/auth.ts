import { api } from './api';

export const signup = (data: { username:string; email:string; password:string }) =>
  api.post('/auth/signup', data);

export const login = (data: { email:string; password:string }) =>
  api.post<{ token:string }>('/auth/login', data);
import axiosClient from './client';
import { User } from '@/types/user';

export async function fetchUserInfo(): Promise<User> {
  const { data } = await axiosClient.get<{ data: User }>('/me/profile');
  return data.data;
}

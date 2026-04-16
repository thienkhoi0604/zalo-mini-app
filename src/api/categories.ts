import { AppCategory } from '@/types/voucher';
import axiosClient from './client';

export async function getCategories(): Promise<AppCategory[]> {
  const { data } = await axiosClient.get<{ data: AppCategory[] }>('/app/categories');
  return data.data ?? [];
}

import axiosClient from './client';
import type { Store } from 'types/store';

export async function getStores(): Promise<Store[]> {
  const { data } = await axiosClient.get<Store[]>('/stores');
  return data;
}

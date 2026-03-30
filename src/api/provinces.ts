import axiosClient from '@/api/client';
import { Province } from '@/types/station';

export async function fetchProvinces(): Promise<Province[]> {
  try {
    const { data } = await axiosClient.get<Province[]>('/app/location/provinces');
    return data;
  } catch {
    return [];
  }
}

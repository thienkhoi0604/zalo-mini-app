import axiosClient from '@/apis/client';
import { Ward } from '@/types/station';

export async function fetchWards(provinceCode: string): Promise<Ward[]> {
  try {
    const { data } = await axiosClient.get<Ward[]>('/app/location/wards', {
      params: { provinceCode },
    });
    return data;
  } catch {
    return [];
  }
}

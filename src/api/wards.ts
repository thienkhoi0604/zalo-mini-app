import axiosClient from '@/api/client';
import { Ward } from '@/types/station';

export async function fetchWards(provinceCode: string): Promise<Ward[]> {
  try {
    const { data } = await axiosClient.get<{ data: Ward[] }>('/app/location/wards', {
      params: { provinceCode },
    });
    return data.data ?? [];
  } catch {
    return [];
  }
}

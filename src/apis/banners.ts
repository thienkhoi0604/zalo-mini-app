import axios from 'axios';
import { API_BASE_URL } from './client';
import { Banner } from '@/types/banner';

export async function getBanners(placement = 'Home'): Promise<Banner[]> {
  const { data } = await axios.get<{ success: boolean; data: Banner[] }>(
    `${API_BASE_URL}/app/banners`,
    { params: { placement } },
  );
  return data.data ?? [];
}

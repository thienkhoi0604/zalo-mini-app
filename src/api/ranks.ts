import axiosClient from './client';
import { AppRank } from '@/types/rank';

interface AppRanksResponse {
  success: boolean;
  data: {
    items: AppRank[];
  };
}

export async function fetchAppRanks(): Promise<AppRank[]> {
  try {
    const { data } = await axiosClient.get<AppRanksResponse>('/app/ranks');
    return data.data.items ?? [];
  } catch {
    return [];
  }
}

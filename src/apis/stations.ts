import axiosClient from '@/apis/client';
import { Station, StationsApiResponse, GetStationsParams } from '@/types/station';
import mockData from '@/mock/stations.json';

export async function getStations(params: GetStationsParams = {}): Promise<StationsApiResponse> {
  try {
    const { data } = await axiosClient.get<StationsApiResponse>('/stations', { params });
    return data;
  } catch (error) {
    console.warn('Failed to fetch stations from API, falling back to mock data:', error);
    return mockData as StationsApiResponse;
  }
}

export const MOCK_STATIONS: Station[] = mockData.data.items as Station[];

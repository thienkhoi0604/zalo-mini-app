import axiosClient from './client';
import type { Station, StationsApiResponse } from 'types/station';
import mockData from 'mock/stations.json';

export interface GetStationsParams {
  pageNumber?: number;
  pageSize?: number;
}

export async function getStations(params: GetStationsParams = {}): Promise<StationsApiResponse> {
  const { data } = await axiosClient.get<StationsApiResponse>('/stations', { params });
  return data;
}

export const MOCK_STATIONS: Station[] = mockData.data.items as Station[];

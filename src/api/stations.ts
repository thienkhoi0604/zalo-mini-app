import axiosClient from '@/api/client';
import { Station, StationsApiResponse, GetStationsParams } from '@/types/station';

export async function getStations(params: GetStationsParams = {}): Promise<StationsApiResponse> {
  try {
    const { data } = await axiosClient.get<StationsApiResponse>('/stations', { params });
    return data;
  } catch {
    const { pageNumber = 1, pageSize = 5 } = params;
    return {
      success: false,
      message: '',
      data: { items: [], pageNumber, pageSize, totalCount: 0, totalPages: 0, hasPrevious: false, hasNext: false },
      errors: null,
    };
  }
}

export async function getStationById(id: string): Promise<Station | null> {
  try {
    const { data } = await axiosClient.get<{ data: Station }>(`/stations/${id}`);
    return data.data;
  } catch {
    return null;
  }
}

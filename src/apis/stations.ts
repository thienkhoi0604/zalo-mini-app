import axiosClient from '@/apis/client';
import { Station, StationsApiResponse, GetStationsParams } from '@/types/station';
import mockData from '@/mock/stations.json';

export const MOCK_STATIONS: Station[] = mockData.data.items as Station[];

function applyMockFilters(items: Station[], params: GetStationsParams): Station[] {
  let result = items;
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q),
    );
  }
  if (params.provinceCode) {
    result = result.filter((s) => s.provinceCode === params.provinceCode);
  }
  if (params.wardCode) {
    result = result.filter((s) => s.wardCode === params.wardCode);
  }
  return result;
}

function buildMockResponse(items: Station[], params: GetStationsParams): StationsApiResponse {
  const { pageNumber = 1, pageSize = 5 } = params;
  const start = (pageNumber - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return {
    success: true,
    message: '',
    data: {
      items: paged,
      pageNumber,
      pageSize,
      totalCount: items.length,
      totalPages: Math.ceil(items.length / pageSize),
      hasPrevious: pageNumber > 1,
      hasNext: start + pageSize < items.length,
    },
    errors: null,
  };
}

export async function getStations(params: GetStationsParams = {}): Promise<StationsApiResponse> {
  try {
    const { data } = await axiosClient.get<StationsApiResponse>('/stations', { params });
    return data;
  } catch (error) {
    console.warn('Failed to fetch stations from API, falling back to mock data:', error);
    const filtered = applyMockFilters(MOCK_STATIONS, params);
    return buildMockResponse(filtered, params);
  }
}

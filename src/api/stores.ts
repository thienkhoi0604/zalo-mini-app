import axiosClient from './client';

export interface AppStore {
  id: string;
  code: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  provinceCode: string | null;
  provinceName: string | null;
  wardCode: string | null;
  wardName: string | null;
  description: string | null;
  imageUrl: string | null;
  storeImageUrl: string | null;
  phone: string | null;
  operatingHours: string | null;
  openTime: string | null;
  closeTime: string | null;
  distanceKm: number | null;
  googleMapsDirectionUrl: string | null;
  stations: unknown[];
}

export async function getStores(params: { pageNumber?: number; pageSize?: number } = {}): Promise<{ items: AppStore[]; hasNext: boolean }> {
  try {
    const { pageNumber = 1, pageSize = 50 } = params;
    const { data } = await axiosClient.get<{
      data: { items: AppStore[]; hasNext: boolean };
    }>('/app/stores', { params: { pageNumber, pageSize } });
    return { items: data.data.items ?? [], hasNext: data.data.hasNext ?? false };
  } catch {
    return { items: [], hasNext: false };
  }
}

export async function getStoreById(id: string): Promise<AppStore | null> {
  try {
    const { data } = await axiosClient.get<{ data: AppStore }>(`/app/stores/${id}`);
    return data.data;
  } catch {
    return null;
  }
}

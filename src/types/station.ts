export interface Station {
  id: string;
  code: string;
  name: string;
  stationTypeId: string;
  stationTypeName: string;
  storeId: string | null;
  storeName: string | null;
  address: string;
  provinceCode: string;
  provinceName: string | null;
  wardCode: string;
  wardName: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  isActive: boolean;
  defaultPoint: number | null;
  minCheckinIntervalMinutes: number | null;
  maxCheckinPerDay: number | null;
  googleMapsDirectionUrl: string;
  imageUrl: string | null;
}

export interface StationsApiResponse {
  success: boolean;
  message: string;
  data: {
    items: Station[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
  errors: unknown | null;
}

export interface GetStationsParams {
  pageNumber?: number;
  pageSize?: number;
}

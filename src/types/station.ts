export interface Province {
  code: string;
  name: string;
  fullName: string;
}

export interface Ward {
  code: string;
  name: string;
  fullName: string;
  provinceCode: string;
}

export interface PillarConfig {
  powerKW: string;
  pillarCount: number;
}

export interface TimeMultiplierConfig {
  startTime: string;
  endTime: string;
  multiplier: number;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  distanceKm?: number;
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
  pillarConfigs: PillarConfig[] | null;
  timeMultiplierConfigs: TimeMultiplierConfig[] | null;
  googleMapsDirectionUrl: string;
  imageUrl: string | null;
  amenities: string | null;
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
  search?: string;
  provinceCode?: string;
  wardCode?: string;
}

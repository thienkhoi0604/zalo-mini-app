export type CheckinPayload = {
  stationCode: string;
  vehicleTypeCode: string;
  checkinAt: string;
  zaloAccessToken: string;
  code: string;
};

export type CheckinResponse = {
  success: boolean;
  message?: string;
  data?: {
    points?: number;
  };
};

export interface CheckinHistoryItem {
  id: string;
  stationName: string;
  stationCode: string;
  stationTypeName: string;
  vehicleTypeName: string;
  pointEarned: number;
  checkinAt: string;
}

export interface GetCheckinHistoryParams {
  pageNumber?: number;
  pageSize?: number;
}

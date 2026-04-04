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
    checkinId?: string;
    stationName?: string;
    pointEarned?: number;
    isPointLocked?: boolean;
    currentPointBalance?: number;
    lockedBalance?: number;
    ruleApplied?: string | null;
    checkinTime?: string;
  };
  errors?: unknown;
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

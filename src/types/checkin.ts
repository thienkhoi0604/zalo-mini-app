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

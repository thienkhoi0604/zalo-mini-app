import axiosClient from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckinPayload = {
  stationCode: string;
  vehicleTypeCode: string;
  checkinAt: string;
  latitude: number;
  longitude: number;
};

export type CheckinResponse = {
  success: boolean;
  message?: string;
  data?: {
    points?: number;
  };
};

// ─── API ──────────────────────────────────────────────────────────────────────

export async function checkin(
  payload: CheckinPayload,
): Promise<CheckinResponse> {
  const { data } = await axiosClient.post<CheckinResponse>(
    '/Checkins',
    payload,
  );
  return data;
}

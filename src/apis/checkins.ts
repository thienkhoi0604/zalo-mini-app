import axiosClient from './client';
import { CheckinPayload, CheckinResponse } from '@/types/checkin';

export async function checkin(payload: CheckinPayload): Promise<CheckinResponse> {
  const { data } = await axiosClient.post<CheckinResponse>('/Checkins', payload);
  return data;
}

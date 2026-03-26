import axiosClient from './client';
import { CheckinPayload, CheckinResponse, CheckinHistoryItem, GetCheckinHistoryParams } from '@/types/checkin';
import { PaginatedApiResponse } from '@/types/common';
import mockItems from '@/mock/checkin-history.json';

export async function checkin(payload: CheckinPayload): Promise<CheckinResponse> {
  const { data } = await axiosClient.post<CheckinResponse>('/Checkins', payload);
  return data;
}

export async function getCheckinHistory(
  params: GetCheckinHistoryParams = {},
): Promise<PaginatedApiResponse<CheckinHistoryItem>> {
  const { pageNumber = 1, pageSize = 5 } = params;
  try {
    const { data } = await axiosClient.get<{ success: boolean; data: CheckinHistoryItem[] }>(
      '/Checkins/history',
      { params: { pageNumber, pageSize } },
    );
    const all: CheckinHistoryItem[] = Array.isArray(data.data) ? data.data : [];
    const start = (pageNumber - 1) * pageSize;
    const items = all.slice(start, start + pageSize);
    return {
      success: true,
      data: {
        items,
        pageNumber,
        pageSize,
        totalCount: all.length,
        hasNext: start + pageSize < all.length,
      },
    };
  } catch {
    const all = mockItems.data as CheckinHistoryItem[];
    const start = (pageNumber - 1) * pageSize;
    const items = all.slice(start, start + pageSize);
    return {
      success: true,
      data: {
        items,
        pageNumber,
        pageSize,
        totalCount: all.length,
        hasNext: start + pageSize < all.length,
      },
    };
  }
}

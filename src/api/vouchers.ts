import { Voucher, UserVoucher, VoucherApiItem, GetUserVouchersParams } from '@/types/voucher';
import { PaginatedApiResponse } from '@/types/common';
import axiosClient from './client';

function mapApiItemToVoucher(item: VoucherApiItem): Voucher {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    type: item.type,
    description: item.description ?? '',
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    category: item.type,
    source: 'Reward',
    costCurrency: 'Points',
    pointsRequired: item.pointCost,
    applicableTimeStart: item.validFrom ?? '',
    applicableTimeEnd: item.validTo ?? '',
    programNotes: '',
    usageGuide: '',
    status: item.isActive ? 'active' : 'expired',
    appliesToAll: item.appliesToAll,
    stores: item.storeNames?.map((name, i) => ({
      id: item.storeIds?.[i],
      name,
    })),
  };
}

export async function getVoucherById(id: string): Promise<Voucher | null> {
  try {
    const { data } = await axiosClient.get<{ data: VoucherApiItem }>(`/Rewards/${id}`);
    return mapApiItemToVoucher(data.data);
  } catch {
    return null;
  }
}

export async function getUserVouchers(
  params: GetUserVouchersParams = {},
): Promise<PaginatedApiResponse<UserVoucher>> {
  const { pageNumber = 1, pageSize = 5 } = params;
  try {
    const { data } = await axiosClient.get<{
      success: boolean;
      data: {
        items: UserVoucher[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        hasNext: boolean;
      };
    }>('/Rewards/my-vouchers', { params: { pageNumber, pageSize } });
    const items: UserVoucher[] = data.data.items ?? [];
    return {
      success: true,
      data: {
        items,
        pageNumber: data.data.pageNumber ?? pageNumber,
        pageSize: data.data.pageSize ?? pageSize,
        totalCount: data.data.totalCount ?? items.length,
        hasNext: data.data.hasNext ?? false,
      },
    };
  } catch {
    return {
      success: false,
      data: { items: [], pageNumber, pageSize, totalCount: 0, hasNext: false },
    };
  }
}

export async function getUserVouchersCount(): Promise<number> {
  try {
    const { data } = await axiosClient.get<{
      data: { totalCount: number };
    }>('/Rewards/my-vouchers', { params: { pageNumber: 1, pageSize: 1, IsUsed: false } });
    return data.data.totalCount ?? 0;
  } catch {
    return 0;
  }
}

export type RedeemItemType = 'Reward' | 'Product';

export async function redeemVoucher(
  rewardId: string,
  itemType: RedeemItemType,
): Promise<{ pointsDeducted: number }> {
  const { data } = await axiosClient.post<{ data: { pointsDeducted: number } }>(
    '/Rewards/redeem',
    { rewardId, itemType },
  );
  return data.data;
}

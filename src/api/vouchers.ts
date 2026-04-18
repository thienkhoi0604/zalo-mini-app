import { Voucher, UserVoucher, VoucherApiItem, StoreItemApiResponse, GetUserVouchersParams } from '@/types/voucher';
import { PaginatedApiResponse } from '@/types/common';
import axiosClient from './client';

function mapApiItemToVoucher(item: VoucherApiItem): Voucher {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    type: item.type,
    description: item.description ?? '',
    shortDescription: item.shortDescription ?? undefined,
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    itemTypeLabel: item.type,
    categoryId: null,
    categoryName: null,
    source: 'Reward',
    costCurrency: 'Lá',
    pointsRequired: item.pointCost,
    applicableTimeStart: item.validFrom ?? '',
    applicableTimeEnd: item.validTo ?? '',
    programNotes: '',
    usageGuide: '',
    status: item.isActive ? 'active' : 'expired',
    appliesToAll: item.appliesToAll,
    stores: item.appliedStores?.length
      ? item.appliedStores.map((s) => ({
          id: s.id,
          name: s.name,
          address: s.address ?? undefined,
          imageUrl: s.imageUrl,
          googleMapsDirectionUrl: s.googleMapsDirectionUrl,
        }))
      : item.storeNames?.map((name, i) => ({ id: item.storeIds?.[i], name })),
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

function mapStoreItemToVoucher(item: StoreItemApiResponse): Voucher {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    type: item.typeName,
    description: item.description ?? '',
    shortDescription: item.shortDescription ?? undefined,
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    itemTypeLabel: item.typeLabel || item.typeName,
    categoryId: item.categoryId ?? null,
    categoryName: item.categoryName ?? null,
    source: 'StoreItem',
    brandName: item.storeName,
    costCurrency: 'GreenCoin',
    pointsRequired: item.coinCost ?? 0,
    price: item.price,
    stock: item.stock,
    applicableTimeStart: '',
    applicableTimeEnd: '',
    programNotes: '',
    usageGuide: '',
    status: 'active',
    stores: [{
      id: item.storeId,
      name: item.storeName,
      address: [item.address, item.wardName, item.provinceName].filter(Boolean).join(', ') || undefined,
      imageUrl: item.storeImageUrl,
      googleMapsDirectionUrl: item.googleMapsDirectionUrl,
    }],
    appliedVoucherDetails: item.appliedVoucherDetails ?? [],
    calculatedPrices: item.calculatedPrices ?? [],
  };
}

export async function getStoreItemById(id: string): Promise<Voucher | null> {
  try {
    const { data } = await axiosClient.get<{ data: StoreItemApiResponse }>(`/app/store-items/${id}`);
    return mapStoreItemToVoucher(data.data);
  } catch {
    return null;
  }
}

export async function getUserVouchers(
  params: GetUserVouchersParams = {},
): Promise<PaginatedApiResponse<UserVoucher>> {
  const { pageNumber = 1, pageSize = 5, isUsed } = params;
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
    }>('/Rewards/my-vouchers', {
      params: {
        pageNumber,
        pageSize,
        ...(isUsed !== undefined && { IsUsed: isUsed }),
      },
    });
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

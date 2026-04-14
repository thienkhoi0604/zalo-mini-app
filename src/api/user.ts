import axiosClient from './client';
import { User, VehicleInfo } from '@/types/user';
import { PointWallet } from '@/types/point-wallet';
import { PointTransaction } from '@/types/point-transaction';

export interface AppVehicleType {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  imageUrl: string | null;
}

export async function getVehicleTypes(): Promise<AppVehicleType[]> {
  try {
    const { data } = await axiosClient.get<{ data: { items: AppVehicleType[] } }>('/app/vehicle-types');
    return data.data.items ?? [];
  } catch {
    return [];
  }
}

export interface VerifyVehiclePayload {
  vehicleTypeId: string;
  licensePlate: string;
  photoUrl1: string;
  photoUrl2?: string;
}

export async function fetchUserInfo(): Promise<User> {
  const { data } = await axiosClient.get<{ data: User }>('/me/profile');
  return data.data;
}

export async function verifyVehicle(payload: VerifyVehiclePayload): Promise<void> {
  await axiosClient.post('/me/vehicles/submit', payload);
}

// Returns [] when not yet submitted, null on error
export async function fetchVehicleInfo(): Promise<VehicleInfo[] | null> {
  try {
    const { data } = await axiosClient.get<{ data: VehicleInfo[] }>('/me/vehicles');
    return data.data ?? [];
  } catch {
    return null;
  }
}

export async function scanQRCode(scannedUserId: string): Promise<{ points: number; totalPoints?: number }> {
  const { data } = await axiosClient.post('/qr-code/scan', { scannedUserId });
  return data;
}


export type QRSessionType = 'Checkin' | 'Voucher' | 'Product';

export async function fetchQRSession(
  assetId: string | null = null,
  type: QRSessionType = 'Checkin',
): Promise<{ token: string; expiresInSeconds: number }> {
  const { data } = await axiosClient.post<{ data: { token: string; expiresInSeconds: number } }>(
    '/me/qr/session',
    { assetId, type },
  );
  return data.data;
}

export async function scanReferralCode(referralCode: string): Promise<void> {
  await axiosClient.post('/app/referrals/scan', { referralCode });
}

export async function fetchReferralQR(): Promise<string> {
  try {
    const { data } = await axiosClient.get<{ data: string }>('/me/referral-qr');
    return data.data;
  } catch {
    return '';
  }
}

export async function getPointTransactions(): Promise<PointTransaction[]> {
  try {
    const { data } = await axiosClient.get<{ data: PointTransaction[] }>('/me/point-transactions');
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchPointWallet(): Promise<PointWallet> {
  try {
    const { data } = await axiosClient.get<{ data: PointWallet }>('/me/point-wallet');
    return data.data;
  } catch {
    return { currentBalance: 0, lockedBalance: 0, vehicleStatus: '', totalEarned: 0, totalSpent: 0, greenCoin: 0, lastEarnedAt: null, lastSpentAt: null };
  }
}

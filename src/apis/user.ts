import axiosClient from './client';
import { User, VehicleInfo } from '@/types/user';
import { PointWallet } from '@/types/point-wallet';
import mockVehicles from '@/mock/my-vehicles.json';
import mockReferralQr from '@/mock/my-referral-qr.json';

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

export async function fetchVehicleInfo(): Promise<VehicleInfo | null> {
  try {
    const { data } = await axiosClient.get<{ data: VehicleInfo[] }>('/me/vehicles');
    return data.data?.[0] ?? null;
  } catch {
    return (mockVehicles.data?.[0] as VehicleInfo) ?? null;
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
    return mockReferralQr.data;
  }
}

export async function fetchPointWallet(): Promise<PointWallet> {
  try {
    const { data } = await axiosClient.get<{ data: PointWallet }>('/me/point-wallet');
    return data.data;
  } catch {
    return { currentBalance: 0, lockedBalance: 0, vehicleStatus: '', totalEarned: 0, totalSpent: 0, lastEarnedAt: null, lastSpentAt: null };
  }
}

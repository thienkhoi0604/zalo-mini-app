import axiosClient from './client';
import { User, VehicleInfo } from '@/types/user';
import { PointWallet } from '@/types/point-wallet';
import pointWalletJson from '@/mock/user-point-wallet.json';

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
    const { data } = await axiosClient.get<{ data: VehicleInfo }>('/me/vehicles');
    return data.data;
  } catch {
    return null;
  }
}

export async function fetchPointWallet(): Promise<PointWallet> {
  try {
    const { data } = await axiosClient.get<{ data: PointWallet }>('/me/point-wallet');
    return data.data;
  } catch (error) {
    console.warn('Failed to fetch point wallet, falling back to mock:', error);
    return pointWalletJson.data as PointWallet;
  }
}

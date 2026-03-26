import axiosClient from './client';
import { User } from '@/types/user';
import { PointWallet } from '@/types/point-wallet';
import pointWalletJson from '@/mock/user-point-wallet.json';

export async function fetchUserInfo(): Promise<User> {
  const { data } = await axiosClient.get<{ data: User }>('/me/profile');
  return data.data;
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

import { checkin } from '@/apis/checkins';
import { getZaloLocationToken, getZaloAccessToken } from '@/helpers/user';

export type ScanResult =
  | { status: 'success'; points?: number }
  | { status: 'error'; message: string }
  | { status: 'cancelled' };

export async function runScan(): Promise<ScanResult> {
  try {
    const [zaloAccessToken, locationToken] = await Promise.all([
      getZaloAccessToken(),
      getZaloLocationToken(),
    ]);

    const { scanQRCode } = await import('zmp-sdk');
    if (typeof scanQRCode !== 'function') {
      throw new Error('Tính năng quét QR chưa được hỗ trợ');
    }

    const scanData = await scanQRCode();
    if (!scanData) return { status: 'cancelled' };

    const raw = scanData as { content?: string } | string;
    const stationCode = typeof raw === 'object' && raw.content ? raw.content : String(raw);

    const response = await checkin({
      stationCode,
      vehicleTypeCode: 'ELECTRIC_CAR',
      checkinAt: new Date().toISOString(),
      zaloAccessToken,
      code: locationToken,
    });

    return { status: 'success', points: response?.data?.points };
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      status: 'error',
      message: err?.response?.data?.message ?? err?.message ?? 'Có lỗi xảy ra khi quét mã QR',
    };
  }
}

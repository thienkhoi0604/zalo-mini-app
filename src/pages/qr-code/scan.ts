import { checkin } from '@/api/checkins';
import { scanReferralCode } from '@/api/user';
import { getZaloLocationToken, getZaloAccessToken } from '@/utils/zalo';

export type CheckinStation = {
  stationName?: string;
  isPointLocked?: boolean;
  checkinTime?: string;
};

export type ScanResult =
  | { status: 'success'; type: 'checkin'; points?: number; currentPointBalance?: number; station?: CheckinStation }
  | { status: 'success'; type: 'referral' }
  | { status: 'error'; message: string }
  | { status: 'cancelled' };

function parseReferralCode(content: string): string | null {
  try {
    const params = new URLSearchParams(content);
    if (params.get('type') === 'ref') {
      return params.get('code');
    }
  } catch {
    // not parseable
  }
  return null;
}

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
    const content = typeof raw === 'object' && raw.content ? raw.content : String(raw);

    // Referral QR: type=ref&code=XXXXXXXX
    const referralCode = parseReferralCode(content);
    if (referralCode) {
      await scanReferralCode(referralCode);
      return { status: 'success', type: 'referral' };
    }

    // Default: station checkin
    const response = await checkin({
      stationCode: content,
      vehicleTypeCode: 'ELECTRIC_CAR',
      checkinAt: new Date().toISOString(),
      zaloAccessToken,
      code: locationToken,
    });

    return {
      status: 'success',
      type: 'checkin',
      points: response?.data?.pointEarned,
      currentPointBalance: response?.data?.currentPointBalance,
      station: {
        stationName: response?.data?.stationName,
        isPointLocked: response?.data?.isPointLocked,
        checkinTime: response?.data?.checkinTime,
      },
    };
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      status: 'error',
      message: err?.response?.data?.message ?? err?.message ?? 'Có lỗi xảy ra khi quét mã QR',
    };
  }
}

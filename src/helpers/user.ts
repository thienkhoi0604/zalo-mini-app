import { getLocation } from 'zmp-sdk';
import { getAccessToken } from 'zmp-sdk/apis';

export async function getZaloLocationToken(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    getLocation({
      success: (res: any) => {
        if (res?.token) {
          resolve(res.token);
        } else {
          reject(new Error('Không lấy được token vị trí'));
        }
      },
      fail: (err: any) => reject(err),
    });
  });
}

export async function getZaloAccessToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error('Không lấy được Zalo access token');
  return token;
}

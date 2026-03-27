import { getLocation } from 'zmp-sdk';
import { getAccessToken } from 'zmp-sdk/apis';

const LOCATION_PERMISSION_KEY = 'zalo_location_permission_granted';

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

/**
 * Request location permission once. If the user has already granted it
 * (tracked in localStorage), the prompt is not shown again.
 */
export async function requestLocationPermissionOnce(): Promise<void> {
  if (localStorage.getItem(LOCATION_PERMISSION_KEY) === 'true') return;

  try {
    await getZaloLocationToken();
    localStorage.setItem(LOCATION_PERMISSION_KEY, 'true');
  } catch {
    // User denied or device unavailable — silently ignore
  }
}

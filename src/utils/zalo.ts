import { getLocation } from 'zmp-sdk';
import { getAccessToken, authorize, getSetting } from 'zmp-sdk/apis';

export type PermissionResult =
  | { status: 'granted' }
  | { status: 'denied_info' }
  | { status: 'denied_location' };

export async function requestZaloPermissions(): Promise<PermissionResult> {
  try {
    const { authSetting } = await getSetting();
    if (authSetting['scope.userInfo'] === true && authSetting['scope.userLocation'] === true) {
      return { status: 'granted' };
    }

    const data = await authorize({
      scopes: ['scope.userInfo', 'scope.userLocation'],
    });
    if (!data['scope.userInfo']) return { status: 'denied_info' };
    if (!data['scope.userLocation']) return { status: 'denied_location' };
    return { status: 'granted' };
  } catch {
    return { status: 'denied_info' };
  }
}

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

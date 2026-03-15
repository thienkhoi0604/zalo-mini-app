import { create } from "zustand";
import { getLocation, getPhoneNumber } from "zmp-sdk";
import { calculateDistance } from "utils/location";
import { Store } from "types/delivery";

type DeliveryStore = {
  stores: Store[];
  nearbyStores: (location: { latitude: string; longitude: string } | false) => (Store & { distance?: number })[];
  selectedStoreIndex: number;
  selectedDeliveryTime: number;
  requestLocationTries: number;
  requestPhoneTries: number;
  location: { latitude: string; longitude: string } | false;
  phone: string | boolean;
  setSelectedStoreIndex: (index: number) => void;
  setSelectedDeliveryTime: (time: number) => void;
  retryLocation: () => Promise<void>;
  retryPhone: () => Promise<void>;
};

const defaultStores: Store[] = [
  {
    id: 1,
    name: "VNG Campus Store",
    address:
      "Khu chế xuất Tân Thuận, Z06, Số 13, Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh, Việt Nam",
    lat: 10.741639,
    long: 106.714632,
  },
  {
    id: 2,
    name: "The Independence Palace",
    address:
      "135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
    lat: 10.779159,
    long: 106.695271,
  },
  {
    id: 3,
    name: "Saigon Notre-Dame Cathedral Basilica",
    address:
      "1 Công xã Paris, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
    lat: 10.779738,
    long: 106.699092,
  },
  {
    id: 4,
    name: "Bình Quới Tourist Village",
    address:
      "1147 Bình Quới, phường 28, Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam",
    lat: 10.831098,
    long: 106.733128,
  },
  {
    id: 5,
    name: "Củ Chi Tunnels",
    address: "Phú Hiệp, Củ Chi, Thành phố Hồ Chí Minh, Việt Nam",
    lat: 11.051655,
    long: 106.494249,
  },
];

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  stores: defaultStores,
  nearbyStores: (location) => {
    const stores = get().stores;
    if (!location) return [];
    const storesWithDistance = stores.map((store) => ({
      ...store,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        store.lat,
        store.long
      ),
    }));
    return storesWithDistance.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  },
  selectedStoreIndex: 0,
  selectedDeliveryTime: +new Date(),
  requestLocationTries: 0,
  requestPhoneTries: 0,
  location: false,
  phone: false,
  setSelectedStoreIndex: (index) => set({ selectedStoreIndex: index }),
  setSelectedDeliveryTime: (time) => set({ selectedDeliveryTime: time }),
  retryLocation: async () => {
    set((state) => ({ requestLocationTries: state.requestLocationTries + 1 }));
    const { latitude, longitude, token } = await getLocation({
      fail: console.warn,
    });
    if (latitude && longitude) {
      set({ location: { latitude, longitude } });
    } else if (token) {
      console.warn(
        "Sử dụng token này để truy xuất vị trí chính xác của người dùng",
        token
      );
      console.warn(
        "Chi tiết tham khảo: ",
        "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
      );
      console.warn("Giả lập vị trí mặc định: VNG Campus");
      set({
        location: {
          latitude: "10.7287",
          longitude: "106.7317",
        },
      });
    }
  },
  retryPhone: async () => {
    set((state) => ({ requestPhoneTries: state.requestPhoneTries + 1 }));
    try {
      const { number, token } = await getPhoneNumber({ fail: console.warn });
      if (number) {
        set({ phone: number });
        return;
      }
      console.warn(
        "Sử dụng token này để truy xuất số điện thoại của người dùng",
        token
      );
      console.warn(
        "Chi tiết tham khảo: ",
        "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
      );
      console.warn("Giả lập số điện thoại mặc định: 0337076898");
      set({ phone: "0337076898" });
    } catch (error) {
      console.error(error);
      set({ phone: false });
    }
  },
}));


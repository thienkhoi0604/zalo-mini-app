export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  ward?: string;
  province?: string;
  bannerImageUrl?: string;
  thumbnailImageUrl?: string;
  phone?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  points?: number;
  chargingCapacity?: string;
  chargerCount?: number;
  services?: string[];
}



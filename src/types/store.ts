export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  ward?: string;
  province?: string;
  phone?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  points?: number;
}


export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string | null;
  placement: string;
  displayOrder: number;
  isActive: boolean;
  validFrom: string | null;
  validTo: string | null;
  createdAt: string;
}

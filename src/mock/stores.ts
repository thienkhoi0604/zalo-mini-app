import type { Store } from 'types/store';

export const MOCK_STORES: Store[] = [
  {
    id: 'evstation-01',
    name: 'Trạm Sạc EcoGreen - Quận 1',
    description:
      'Trạm sạc ô tô điện hiện đại với công suất cao, hỗ trợ đa dạng loại xe điện. Ngoài dịch vụ sạc pin, trạm còn cung cấp dịch vụ rửa xe, kiểm tra kỹ thuật và sửa chữa cơ bản.',
    address: '123 Nguyễn Huệ, Phường Bến Nghé',
    ward: 'Phường Bến Nghé',
    province: 'TP. Hồ Chí Minh',
    city: 'Quận 1',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=200&q=80&auto=format',
    phone: '02812345678',
    openingHours: '07:00 - 22:00',
    latitude: 10.7756587,
    longitude: 106.7004245,
    note: 'Có chỗ gửi xe máy miễn phí',
    points: 95,
    chargingCapacity: '150 kW',
    chargerCount: 8,
    services: ['Sạc pin', 'Rửa xe', 'Sửa xe', 'Kiểm tra kỹ thuật'],
  },
  {
    id: 'evstation-02',
    name: 'Trạm Sạc EcoGreen - Quận 3',
    description:
      'Trạm sạc pin ô tô điện tiêu chuẩn quốc tế, được trang bị hệ thống giám sát 24/7. Môi trường sạch sẽ, an toàn, có quán cà phê tại khu chờ. Hỗ trợ thanh toán đa hình thức.',
    address: '45 Cách Mạng Tháng 8, Phường 6',
    ward: 'Phường 6',
    province: 'TP. Hồ Chí Minh',
    city: 'Quận 3',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=1200&q=80&auto=format',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=200&q=80&auto=format',
    phone: '02823456789',
    openingHours: '07:00 - 23:00',
    latitude: 10.784,
    longitude: 106.686,
    note: 'Không gian yên tĩnh, phù hợp làm việc',
    points: 88,
    chargingCapacity: '120 kW',
    chargerCount: 6,
    services: ['Sạc pin', 'Kiểm tra kỹ thuật', 'Quán cà phê'],
  },
  {
    id: 'evstation-03',
    name: 'Trạm Sạc EcoGreen - Hà Nội',
    description:
      'Trạm sạc pin lớn nhất tại Hà Nội với công suất sạc tối đa. Tất cả máy sạc đều hỗ trợ sạc nhanh. Có phòng VIP chờ, nhà vệ sinh sạch sẽ, và bãi đỗ xe khách rộng rãi.',
    address: '12 Lý Thường Kiệt, Phường Trần Hưng Đạo',
    ward: 'Phường Trần Hưng Đạo',
    province: 'Hà Nội',
    city: 'Hoàn Kiếm',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1593941707882-a5bba53b6f02?w=1200&q=80&auto=format',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1593941707882-a5bba53b6f02?w=200&q=80&auto=format',
    phone: '02434567890',
    openingHours: '06:30 - 22:30',
    latitude: 21.025,
    longitude: 105.852,
    note: 'Có phòng họp nhỏ, cần đặt trước',
    points: 92,
    chargingCapacity: '200 kW',
    chargerCount: 12,
    services: ['Sạc pin', 'Rửa xe', 'Sửa xe', 'Kiểm tra kỹ thuật', 'Phòng VIP'],
  },
  {
    id: 'evstation-04',
    name: 'Trạm Sạc EcoGreen - Đà Nẵng',
    description:
      'Trạm sạc pin với vị trí đắc địa, gần biển và trung tâm thành phố. Dịch vụ chuyên nghiệp, được đào tạo kinh doanh khách hàng. Hỗ trợ các loại xe điện phổ biến trên thị trường.',
    address: '88 Bạch Đằng, Phường Thạch Thang',
    ward: 'Phường Thạch Thang',
    province: 'Đà Nẵng',
    city: 'Hải Châu',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=1200&q=80&auto=format',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=200&q=80&auto=format',
    phone: '02363789012',
    openingHours: '07:00 - 21:30',
    latitude: 16.071,
    longitude: 108.224,
    note: 'View sông Hàn, phù hợp hẹn hò',
    points: 85,
    chargingCapacity: '100 kW',
    chargerCount: 5,
    services: ['Sạc pin', 'Rửa xe', 'Kiểm tra kỹ thuật'],
  },
];

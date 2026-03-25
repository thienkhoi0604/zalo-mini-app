import { Reward, UserReward } from '@/types/reward';

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'gc-001',
    code: 'COFFEE001',
    name: 'Phiếu 50K Cà Phê',
    description:
      'Sử dụng phiếu để mua một cốc cà phê bất kỳ tại bất kỳ chi nhánh Ecogreen Coffee. Phiếu có giá trị 50.000 VND.',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
    category: 'Phiếu Cà Phê',
    pointsRequired: 500,
    applicableTimeStart: '2026-01-01',
    applicableTimeEnd: '2026-12-31',
    programNotes: 'Không áp dụng cho các combo hoặc khuyến mãi khác',
    usageGuide: 'Hiển thị mã QR tại quầy khi thanh toán để sử dụng phiếu',
    status: 'active',
  },
  {
    id: 'gc-002',
    code: 'COFFEE002',
    name: 'Phiếu 100K Cà Phê',
    description:
      'Sử dụng phiếu để mua một cốc cà phê bất kỳ tại bất kỳ chi nhánh Ecogreen Coffee. Phiếu có giá trị 100.000 VND.',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200',
    category: 'Phiếu Cà Phê',
    pointsRequired: 950,
    applicableTimeStart: '2026-01-01',
    applicableTimeEnd: '2026-12-31',
    programNotes: 'Không áp dụng cho các combo hoặc khuyến mãi khác',
    usageGuide: 'Hiển thị mã QR tại quầy khi thanh toán để sử dụng phiếu',
    status: 'active',
  },
  {
    id: 'gc-003',
    code: 'COFFEE003',
    name: 'Phiếu Free Size Cà Phê',
    description: 'Nhận một cốc cà phê size lớn miễn phí.',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200',
    category: 'Phiếu Cà Phê',
    pointsRequired: 800,
    applicableTimeStart: '2026-01-15',
    applicableTimeEnd: '2026-12-31',
    programNotes: 'Có thể kết hợp với topping phụ thu',
    usageGuide: 'Hiển thị mã QR tại quầy',
    status: 'active',
  },
  {
    id: 'gc-004',
    code: 'BEVERAGE001',
    name: 'Phiếu 40K Nước Uống',
    description: 'Phiếu nước uống bất kỳ.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200',
    category: 'Phiếu Nước Uống',
    pointsRequired: 400,
    applicableTimeStart: '2026-01-01',
    applicableTimeEnd: '2026-12-31',
    programNotes: 'Áp dụng tất cả nước',
    usageGuide: 'Hiển thị mã QR',
    status: 'active',
  },
  {
    id: 'gc-005',
    code: 'BEVERAGE002',
    name: 'Phiếu 80K Nước Uống',
    description: '2 cốc nước bất kỳ.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1546173159-315724a31696?w=200',
    category: 'Phiếu Nước Uống',
    pointsRequired: 750,
    applicableTimeStart: '2026-02-01',
    applicableTimeEnd: '2026-12-31',
    programNotes: 'Dùng 2 lần',
    usageGuide: 'Hiển thị QR',
    status: 'active',
  },
  {
    id: 'gc-006',
    code: 'DISCOUNT001',
    name: 'Giảm Giá 20%',
    description: 'Giảm 20% hoá đơn.',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200',
    category: 'Phiếu Giảm Giá',
    pointsRequired: 600,
    applicableTimeStart: '2026-01-01',
    applicableTimeEnd: '2026-06-30',
    programNotes: 'Max 100K',
    usageGuide: 'Hiển thị QR',
    status: 'active',
  },
  {
    id: 'gc-007',
    code: 'DISCOUNT002',
    name: 'Mua 1 Tặng 1',
    description: 'Buy 1 get 1.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200',
    category: 'Phiếu Giảm Giá',
    pointsRequired: 700,
    applicableTimeStart: '2026-03-01',
    applicableTimeEnd: '2026-05-31',
    programNotes: 'Áp dụng cà phê',
    usageGuide: 'Hiển thị QR',
    status: 'active',
  },
  {
    id: 'gc-008',
    code: 'SEASONAL001',
    name: 'Combo Tết',
    description: 'Cà phê + bánh',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=200',
    category: 'Phiếu Mùa Lễ',
    pointsRequired: 850,
    applicableTimeStart: '2026-01-20',
    applicableTimeEnd: '2026-02-15',
    programNotes: 'Tết',
    usageGuide: 'Hiển thị QR',
    status: 'active',
  },
  {
    id: 'gc-009',
    code: 'SEASONAL002',
    name: 'Combo Mùa Hè',
    description: 'Smoothie + nước',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=200',
    category: 'Phiếu Mùa Lễ',
    pointsRequired: 1200,
    applicableTimeStart: '2026-05-01',
    applicableTimeEnd: '2026-08-31',
    programNotes: 'Mùa hè',
    usageGuide: 'Hiển thị QR',
    status: 'active',
  },
  {
    id: 'gc-010',
    code: 'EXPRESS001',
    name: 'Fast Track',
    description: 'Ưu tiên đơn hàng',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?w=200',
    category: 'Phiếu Đặc Biệt',
    pointsRequired: 300,
    applicableTimeStart: '2026-01-01',
    applicableTimeEnd: '2026-12-31',
    programNotes: 'Không áp dụng giờ cao điểm',
    usageGuide: 'Báo nhân viên',
    status: 'active',
  },
];

export const MOCK_USER_REWARDS: UserReward[] = [
  {
    id: 'ugc-001',
    rewardId: 'gc-001',
    status: 'redeemed',
    redeemedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'ugc-002',
    rewardId: 'gc-004',
    status: 'redeemed',
    redeemedAt: '2026-03-05T10:15:00Z',
  },
  {
    id: 'ugc-003',
    rewardId: 'gc-006',
    status: 'received',
    receivedAt: '2026-02-28T18:00:00Z',
  },
  {
    id: 'ugc-004',
    rewardId: 'gc-008',
    status: 'redeemed',
    redeemedAt: '2026-02-10T09:45:00Z',
  },
];

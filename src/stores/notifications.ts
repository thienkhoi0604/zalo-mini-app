import { create } from 'zustand';
import logo from '@/static/img/logo.png';
import { Notification } from '@/types/notification';

type NotificationsStore = {
  notifications: Notification[];
};

export const useNotificationsStore = create<NotificationsStore>(() => ({
  notifications: [
    {
      id: 1,
      image: logo,
      title: 'Chào mừng đến Ecogreen Coin',
      content:
        'Cảm ơn đã sử dụng Ecogreen Coin, bạn có thể dùng ứng dụng này để tiết kiệm thời gian xây dựng mini app cho giải pháp loyalty của mình',
    },
    {
      id: 2,
      image: logo,
      title: 'Giảm 50% lần đầu mua hàng',
      content: 'Nhập WELCOME để được giảm 50% giá trị đơn hàng đầu tiên order',
    },
  ],
}));

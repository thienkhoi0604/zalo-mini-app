import { ListItem } from "components/list-item";
import React, { FC } from "react";
import { useDeliveryStore } from "stores/delivery";
import { useUserStore } from "stores/user";

export const PersonPicker: FC = () => {
  const zaloUser = useUserStore((s) => s.zaloUser);
  const phone = useDeliveryStore((s) => s.phone);

  return (
    <ListItem
      title={
        zaloUser ? `${zaloUser.name} - ${phone}` : phone
      }
      subtitle="Người nhận"
    />
  );
};

export const RequestPersonPickerPhone: FC = () => {
  const retryPhone = useDeliveryStore((s) => s.retryPhone);
  const phone = useDeliveryStore((s) => s.phone);

  if (phone) {
    return <PersonPicker />;
  }

  return (
    <ListItem
      onClick={() => retryPhone()}
      title="Chọn người nhận"
      subtitle="Yêu cầu truy cập số điện thoại"
    />
  );
};

import { ActionSheet } from "components/fullscreen-sheet";
import { ListItem } from "components/list-item";
import React, { FC, useState } from "react";
import { createPortal } from "react-dom";
import { useDeliveryStore } from "stores/delivery";
import { Store } from "types/delivery";
import { displayDistance } from "utils/location";

export const StorePicker: FC = () => {
  const [visible, setVisible] = useState(false);
  const deliveryStore = useDeliveryStore();
  const nearbyStores = deliveryStore.nearbyStores(deliveryStore.location);
  const setSelectedStoreIndex = deliveryStore.setSelectedStoreIndex;
  const selectedStore =
    nearbyStores[deliveryStore.selectedStoreIndex] ?? nearbyStores[0];

  if (!selectedStore) {
    return <RequestStorePickerLocation />;
  }

  return (
    <>
      <ListItem
        onClick={() => setVisible(true)}
        title={selectedStore.name}
        subtitle={selectedStore.address}
      />
      {nearbyStores.length > 0 &&
        createPortal(
          <ActionSheet
            title="Các cửa hàng ở gần bạn"
            visible={visible}
            onClose={() => setVisible(false)}
            actions={[
              nearbyStores.map((store: Store & { distance?: number }, i) => ({
                  text: store.distance
                    ? `${store.name} - ${displayDistance(store.distance)}`
                    : store.name,
                  highLight: store.id === selectedStore?.id,
                  onClick: () => {
                    setSelectedStoreIndex(i);
                  },
                }),
              ),
              [{ text: "Đóng", close: true, danger: true }],
            ]}
          ></ActionSheet>,
          document.body,
        )}
    </>
  );
};

export const RequestStorePickerLocation: FC = () => {
  const retry = useDeliveryStore((s) => s.retryLocation);
  return (
    <ListItem
      onClick={() => retry((r) => r + 1)}
      title="Chọn cửa hàng"
      subtitle="Yêu cầu truy cập vị trí"
    />
  );
};

import React, { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Box, Page, Header, Text, Icon } from "zmp-ui";
import { MOCK_STORES } from "mock/stores";

const StoreDetailPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const store = useMemo(
    () => MOCK_STORES.find((item) => item.id === id),
    [id]
  );

  if (!store) {
    return (
      <Page className="bg-white">
        <Header
          title="Chi tiết cửa hàng"
          showBackIcon
          onBackClick={() => navigate(-1)}
        />
        <Box className="p-4">
          <Text>Không tìm thấy cửa hàng.</Text>
        </Box>
      </Page>
    );
  }

  const fullAddressParts = [
    store.address,
    store.ward,
    store.city,
    store.province,
  ].filter(Boolean);

  const fullAddress = fullAddressParts.join(", ");

  return (
    <Page className="bg-white">
      <Header
        title="Chi tiết cửa hàng"
        showBackIcon
        onBackClick={() => navigate(-1)}
      />

      <Box className="p-4 space-y-4">
        <Box className="space-y-1">
          <Text size="large" className="font-semibold">
            {store.name}
          </Text>
          <Text className="text-sm text-gray-700">{fullAddress}</Text>
        </Box>

        <Box className="bg-gray-50 rounded-lg p-4 space-y-3">
          <Box className="flex items-start gap-3">
            <Icon icon="zi-location" className="mt-1" />
            <Box className="space-y-1">
              <Text className="font-medium text-sm">Địa chỉ</Text>
              <Text className="text-sm text-gray-700">{fullAddress}</Text>
            </Box>
          </Box>

          {store.phone && (
            <Box className="flex items-start gap-3">
              <Icon icon="zi-call" className="mt-1" />
              <Box className="space-y-1">
                <Text className="font-medium text-sm">Số điện thoại</Text>
                <a href={`tel:${store.phone}`} className="text-sm text-primary">
                  {store.phone}
                </a>
              </Box>
            </Box>
          )}

          {store.openingHours && (
            <Box className="flex items-start gap-3">
              <Icon icon="zi-time" className="mt-1" />
              <Box className="space-y-1">
                <Text className="font-medium text-sm">Giờ mở cửa</Text>
                <Text className="text-sm text-gray-700">
                  {store.openingHours}
                </Text>
              </Box>
            </Box>
          )}

          {store.note && (
            <Box className="flex items-start gap-3">
              <Icon icon="zi-info" className="mt-1" />
              <Box className="space-y-1">
                <Text className="font-medium text-sm">Ghi chú</Text>
                <Text className="text-sm text-gray-700">{store.note}</Text>
              </Box>
            </Box>
          )}

          {store.latitude != null && store.longitude != null && (
            <Box className="flex items-start gap-3">
              <Icon icon="zi-location-solid" className="mt-1" />
              <Box className="space-y-1">
                <Text className="font-medium text-sm">Bản đồ</Text>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary"
                >
                  <span>Mở trên bản đồ</span>
                </a>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default StoreDetailPage;


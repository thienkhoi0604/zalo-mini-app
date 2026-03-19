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
          title="Chi tiết trạm sạc"
          showBackIcon
          onBackClick={() => navigate(-1)}
        />
        <Box className="p-4">
          <Text>Không tìm thấy trạm sạc pin.</Text>
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
        title="Chi tiết trạm sạc"
        showBackIcon
        onBackClick={() => navigate(-1)}
      />

      <Box className="overflow-auto pb-4">
        {/* Banner Image */}
        {store.bannerImageUrl && (
          <Box className="w-full">
            <img
              src={store.bannerImageUrl}
              alt={store.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/400x200?text=Station";
              }}
            />
          </Box>
        )}

        <Box className="p-4 space-y-4">
          {/* Header Info */}
          <Box className="space-y-1">
            <Text size="large" className="font-semibold">
              {store.name}
            </Text>
            <Text className="text-sm text-gray-700">{fullAddress}</Text>
          </Box>

          {/* Main Info Card */}
          <Box className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 space-y-3 border border-blue-200">
            {/* Location */}
            <Box className="flex items-start gap-3">
              <Icon icon="zi-location" className="mt-1 text-blue-600" />
              <Box className="space-y-1 flex-1">
                <Text className="font-medium text-sm">Địa chỉ</Text>
                <Text className="text-sm text-gray-700">{fullAddress}</Text>
              </Box>
            </Box>

            {/* Phone */}
            {store.phone && (
              <Box className="flex items-start gap-3">
                <Icon icon="zi-call" className="mt-1 text-blue-600" />
                <Box className="space-y-1 flex-1">
                  <Text className="font-medium text-sm">Số điện thoại</Text>
                  <a href={`tel:${store.phone}`} className="text-sm text-primary">
                    {store.phone}
                  </a>
                </Box>
              </Box>
            )}

            {/* Opening Hours */}
            {store.openingHours && (
              <Box className="flex items-start gap-3">
                <Text className="text-lg mt-1">🕐</Text>
                <Box className="space-y-1 flex-1">
                  <Text className="font-medium text-sm">Giờ mở cửa</Text>
                  <Text className="text-sm text-gray-700">
                    {store.openingHours}
                  </Text>
                </Box>
              </Box>
            )}

            {/* Map Link */}
            {store.latitude != null && store.longitude != null && (
              <Box className="flex items-start gap-3">
                <Icon
                  icon="zi-location-solid"
                  className="mt-1 text-blue-600"
                />
                <Box className="space-y-1 flex-1">
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

          {/* Description */}
          {store.description && (
            <Box className="space-y-2">
              <Text className="font-semibold">📝 Giới thiệu</Text>
              <Text className="text-sm text-gray-700 leading-relaxed">
                {store.description}
              </Text>
            </Box>
          )}

          {/* Charging Stats */}
          <Box className="grid grid-cols-2 gap-3">
            {store.chargingCapacity && (
              <Box className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <Text className="text-xs text-orange-600 font-medium">
                  Công suất
                </Text>
                <Text className="font-bold text-lg text-orange-600 mt-1">
                  {store.chargingCapacity}
                </Text>
              </Box>
            )}
            {store.chargerCount && (
              <Box className="bg-green-50 p-3 rounded-lg border border-green-200">
                <Text className="text-xs text-green-600 font-medium">
                  Máy sạc
                </Text>
                <Text className="font-bold text-lg text-green-600 mt-1">
                  {store.chargerCount}
                </Text>
              </Box>
            )}
          </Box>

          {/* Services */}
          {store.services && store.services.length > 0 && (
            <Box className="space-y-2">
              <Text className="font-semibold">⚙️ Dịch vụ tại trạm</Text>
              <Box className="flex flex-wrap gap-2">
                {store.services.map((service, index) => (
                  <Box
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {service}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Note */}
          {store.note && (
            <Box className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <Box className="flex items-start gap-2">
                <Text className="text-lg mt-1">⚠️</Text>
                <Box className="space-y-1">
                  <Text className="font-medium text-sm text-yellow-800">
                    Lưu ý
                  </Text>
                  <Text className="text-sm text-yellow-800">{store.note}</Text>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default StoreDetailPage;


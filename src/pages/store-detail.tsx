import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router';
import { Box, Icon, Page, Text } from 'zmp-ui';
import { MOCK_STORES } from 'mock/stores';

const StoreDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const store = useMemo(() => MOCK_STORES.find((item) => item.id === id), [id]);

  if (!store) {
    return (
      <Page className="flex-1 flex flex-col bg-gray-50">
        <Box className="p-4">
          <Text className="text-gray-500">Không tìm thấy trạm sạc pin.</Text>
        </Box>
      </Page>
    );
  }

  const fullAddress = [store.address, store.ward, store.city, store.province]
    .filter(Boolean)
    .join(', ');

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      {/* <AppHeader title="Chi tiết trạm sạc" showBackIcon /> */}

      <Box className="flex-1 overflow-auto pb-6">
        {/* Banner */}
        {store.bannerImageUrl && (
          <img
            src={store.bannerImageUrl}
            alt={store.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format';
            }}
          />
        )}

        <Box className="p-4 space-y-4">
          {/* Tên & địa chỉ */}
          <Box>
            <Text size="large" className="font-semibold text-gray-900">
              {store.name}
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">{fullAddress}</Text>
          </Box>

          {/* Thống kê nhanh */}
          <Box className="grid grid-cols-2 gap-3">
            {store.chargingCapacity && (
              <Box className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                <Text className="text-xs text-orange-500 font-medium">
                  Công suất
                </Text>
                <Text className="font-bold text-lg text-orange-600 mt-1">
                  {store.chargingCapacity}
                </Text>
              </Box>
            )}
            {store.chargerCount && (
              <Box className="bg-green-50 p-3 rounded-xl border border-green-100">
                <Text className="text-xs text-green-500 font-medium">
                  Máy sạc
                </Text>
                <Text className="font-bold text-lg text-green-600 mt-1">
                  {store.chargerCount}
                </Text>
              </Box>
            )}
          </Box>

          {/* Thông tin chi tiết */}
          <Box className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {/* Địa chỉ */}
            <Box className="flex items-start gap-3 p-4">
              <Icon
                icon="zi-location"
                className="text-green-500 mt-0.5 flex-shrink-0"
              />
              <Box>
                <Text className="text-xs text-gray-400 font-medium">
                  Địa chỉ
                </Text>
                <Text className="text-sm text-gray-700 mt-0.5">
                  {fullAddress}
                </Text>
              </Box>
            </Box>

            {/* Số điện thoại */}
            {store.phone && (
              <Box className="flex items-start gap-3 p-4">
                <Icon
                  icon="zi-call"
                  className="text-green-500 mt-0.5 flex-shrink-0"
                />
                <Box>
                  <Text className="text-xs text-gray-400 font-medium">
                    Số điện thoại
                  </Text>
                  <a
                    href={`tel:${store.phone}`}
                    className="text-sm text-blue-500 mt-0.5 block"
                  >
                    {store.phone}
                  </a>
                </Box>
              </Box>
            )}

            {/* Giờ mở cửa */}
            {store.openingHours && (
              <Box className="flex items-start gap-3 p-4">
                <span className="text-base flex-shrink-0 mt-0.5">🕐</span>
                <Box>
                  <Text className="text-xs text-gray-400 font-medium">
                    Giờ mở cửa
                  </Text>
                  <Text className="text-sm text-gray-700 mt-0.5">
                    {store.openingHours}
                  </Text>
                </Box>
              </Box>
            )}

            {/* Bản đồ */}
            {store.latitude != null && store.longitude != null && (
              <Box className="flex items-start gap-3 p-4">
                <Icon
                  icon="zi-location-solid"
                  className="text-green-500 mt-0.5 flex-shrink-0"
                />
                <Box>
                  <Text className="text-xs text-gray-400 font-medium">
                    Bản đồ
                  </Text>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 mt-0.5 block"
                  >
                    Mở trên Google Maps
                  </a>
                </Box>
              </Box>
            )}
          </Box>

          {/* Mô tả */}
          {store.description && (
            <Box className="bg-white rounded-xl border border-gray-100 p-4">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                📝 Giới thiệu
              </Text>
              <Text className="text-sm text-gray-600 leading-relaxed">
                {store.description}
              </Text>
            </Box>
          )}

          {/* Dịch vụ */}
          {store.services && store.services.length > 0 && (
            <Box className="bg-white rounded-xl border border-gray-100 p-4">
              <Text className="text-sm font-semibold text-gray-900 mb-3">
                ⚙️ Dịch vụ tại trạm
              </Text>
              <Box className="flex flex-wrap gap-2">
                {store.services.map((service, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </Box>
            </Box>
          )}

          {/* Lưu ý */}
          {store.note && (
            <Box className="bg-yellow-50 rounded-xl border border-yellow-100 p-4 flex items-start gap-3">
              <span className="text-base flex-shrink-0">⚠️</span>
              <Box>
                <Text className="text-sm font-semibold text-yellow-800 mb-0.5">
                  Lưu ý
                </Text>
                <Text className="text-sm text-yellow-700">{store.note}</Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default StoreDetailPage;

import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router';
import { Box, Page, Text } from 'zmp-ui';
import { MapPin, Navigation } from 'lucide-react';
import { MOCK_STATIONS } from '@/apis/stations';

const StationDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const station = useMemo(() => MOCK_STATIONS.find((item) => item.id === id), [id]);

  if (!station) {
    return (
      <Page className="flex-1 flex flex-col bg-gray-50">
        <Box className="p-4">
          <Text className="text-gray-500">Không tìm thấy trạm sạc.</Text>
        </Box>
      </Page>
    );
  }

  const fullAddress = [station.address, station.wardName, station.provinceName]
    .filter(Boolean)
    .join(', ');

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <Box className="flex-1 overflow-auto pb-6">
        {/* Banner */}
        <img
          src={station.imageUrl ?? 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format'}
          alt={station.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format';
          }}
        />

        <Box className="p-4 space-y-4">
          {/* Tên & loại */}
          <Box>
            <Text size="large" className="font-semibold text-gray-900">
              {station.name}
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">{station.stationTypeName}</Text>
          </Box>

          {/* Thống kê nhanh */}
          {station.defaultPoint != null && (
            <Box className="grid grid-cols-2 gap-3">
              <Box className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                <Text className="text-xs text-orange-500 font-medium">Điểm tích lũy</Text>
                <Text className="font-bold text-lg text-orange-600 mt-1">
                  {station.defaultPoint}
                </Text>
              </Box>
              {station.maxCheckinPerDay != null && (
                <Box className="bg-green-50 p-3 rounded-xl border border-green-100">
                  <Text className="text-xs text-green-500 font-medium">Check-in/ngày</Text>
                  <Text className="font-bold text-lg text-green-600 mt-1">
                    {station.maxCheckinPerDay}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Thông tin chi tiết */}
          <Box className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {/* Địa chỉ */}
            <Box className="flex items-start gap-3 p-4">
              <MapPin size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <Box>
                <Text className="text-xs text-gray-400 font-medium">Địa chỉ</Text>
                <Text className="text-sm text-gray-700 mt-0.5">{fullAddress}</Text>
              </Box>
            </Box>

            {/* Google Maps */}
            <Box className="flex items-start gap-3 p-4">
              <Navigation size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <Box>
                <Text className="text-xs text-gray-400 font-medium">Chỉ đường</Text>
                <a
                  href={station.googleMapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 mt-0.5 block"
                >
                  Mở trên Google Maps
                </a>
              </Box>
            </Box>

            {/* Cửa hàng liên kết */}
            {station.storeName && (
              <Box className="flex items-start gap-3 p-4">
                <span className="text-base flex-shrink-0 mt-0.5">🏪</span>
                <Box>
                  <Text className="text-xs text-gray-400 font-medium">Cửa hàng</Text>
                  <Text className="text-sm text-gray-700 mt-0.5">{station.storeName}</Text>
                </Box>
              </Box>
            )}

            {/* Khoảng cách check-in */}
            {station.minCheckinIntervalMinutes != null && (
              <Box className="flex items-start gap-3 p-4">
                <span className="text-base flex-shrink-0 mt-0.5">🕐</span>
                <Box>
                  <Text className="text-xs text-gray-400 font-medium">Khoảng cách check-in</Text>
                  <Text className="text-sm text-gray-700 mt-0.5">
                    {station.minCheckinIntervalMinutes} phút
                  </Text>
                </Box>
              </Box>
            )}
          </Box>

          {/* Mô tả */}
          {station.description && (
            <Box className="bg-white rounded-xl border border-gray-100 p-4">
              <Text className="text-sm font-semibold text-gray-900 mb-2">📝 Giới thiệu</Text>
              <Text className="text-sm text-gray-600 leading-relaxed">{station.description}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default StationDetailPage;

import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page, Text } from 'zmp-ui';
import type { Station } from 'types/station';
import { MOCK_STATIONS } from 'apis/stations';
import StationCard from './stations/station-card';

export const StationsPage: FC = () => {
  const navigate = useNavigate();
  const stations: Station[] = MOCK_STATIONS;

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <Box className="flex-1 overflow-auto px-4 pt-4">
        {stations.length === 0 ? (
          <Box className="py-8 text-center">
            <Text className="text-gray-500">Không tìm thấy cửa hàng phù hợp.</Text>
          </Box>
        ) : (
          <Box className="pb-4">
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onClick={() => navigate(`/stations/${station.id}`)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default StationsPage;

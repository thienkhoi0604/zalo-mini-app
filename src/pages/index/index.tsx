import React, { useState } from "react";
import { Box, Page } from "zmp-ui";
import { HeroHeader } from "./hero-header";
import { Banner } from "./banner";
import { TopVouchers } from "./top-vouchers";
import { TopStationsCarousel } from "./top-stations";
import PullToRefresh from "@/components/pull-to-refresh";
import { useUserStore } from "@/stores/user";
import { useRewardsStore } from "@/stores/rewards";

const HomePage: React.FunctionComponent = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { loadPointWallet } = useUserStore();
  const { loadAllRewards } = useRewardsStore();

  const handleRefresh = async () => {
    await Promise.all([loadPointWallet(), loadAllRewards()]);
    setRefreshKey((k) => k + 1);
  };

  return (
    <Page className="relative flex-1 flex flex-col" style={{ background: '#F5F5F7' }}>
      <PullToRefresh onRefresh={handleRefresh} className="flex-1 pb-4">
        <div key={refreshKey}>
          <HeroHeader />

          {/* Banner */}
          <Box className="mt-4">
            <Banner />
          </Box>

          {/* Vouchers */}
          <Box
            className="mx-4 mt-4 rounded-2xl bg-white"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
          >
            <TopVouchers />
          </Box>

          {/* Stations */}
          <Box
            className="mx-4 mt-4 rounded-2xl bg-white"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
          >
            <TopStationsCarousel />
          </Box>
        </div>
      </PullToRefresh>
    </Page>
  );
};

export default HomePage;

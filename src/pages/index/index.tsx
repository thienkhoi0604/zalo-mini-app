import React, { useState } from "react";
import { Box, Page } from "zmp-ui";
import { HeroHeader } from "./hero-header";
import { Banner } from "./banner";
import { TopVouchers } from "./top-vouchers";
import { TopStationsCarousel } from "./top-stations";
import { TopStores } from "./top-stores";
import PullToRefresh from "@/components/ui/pull-to-refresh";
import { useUserStore } from "@/store/user";
import { useVouchersStore } from "@/store/vouchers";
import { useBannersStore } from "@/store/banners";
import { ACTIVE_THEME } from "@/constants/theme";

const HOME_SCROLL_KEY = 'home-scroll-section';

const HomePage: React.FunctionComponent = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { loadPointWallet, isAuthenticated } = useUserStore();
  const { loadAllVouchers, loadUserVouchersCount } = useVouchersStore();
  const { loadBanners } = useBannersStore();

  React.useEffect(() => {
    if (isAuthenticated) loadUserVouchersCount();
  }, [isAuthenticated]);

  // Scroll to section when returning from a detail page
  React.useEffect(() => {
    const sectionId = sessionStorage.getItem(HOME_SCROLL_KEY);
    if (!sectionId) return;
    sessionStorage.removeItem(HOME_SCROLL_KEY);
    const timer = setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    const tasks: Promise<void>[] = [loadAllVouchers(), loadBanners()];
    if (isAuthenticated) tasks.push(loadPointWallet(), loadUserVouchersCount());
    await Promise.all(tasks);
    setRefreshKey((k) => k + 1);
  };


  return (
    <Page className="relative flex-1 flex flex-col" style={{ background: ACTIVE_THEME.pageBg }}>
      <PullToRefresh onRefresh={handleRefresh} className="flex-1 pb-4">
        <div key={refreshKey}>
          <HeroHeader />

          {/* Banner */}
          <Box className="mt-4">
            <Banner />
          </Box>

          {/* Vouchers */}
          <Box
            id="section-vouchers"
            className="mx-4 mt-4 rounded-2xl bg-white"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
          >
            <TopVouchers />
          </Box>

          {/* Stores */}
          <Box
            id="section-stores"
            className="mx-4 mt-4 rounded-2xl bg-white"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
          >
            <TopStores />
          </Box>

          {/* Stations */}
          <Box
            id="section-stations"
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

import React from "react";
import { Box, Page } from "zmp-ui";
import { HeroHeader } from "./hero-header";
import { Banner } from "./banner";
import { TopVouchers } from "./top-vouchers";
import { TopStationsCarousel } from "./top-stations";

const HomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col" style={{ background: '#F5F5F7' }}>
      <Box className="flex-1 overflow-auto pb-4">
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
      </Box>
    </Page>
  );
};

export default HomePage;

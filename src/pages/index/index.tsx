import React from "react";
import { Box, Page } from "zmp-ui";
import { Inquiry } from "./inquiry";
import { Banner } from "./banner";
import { TopStationsCarousel } from "./top-stations";
import { Divider } from "components/divider";

const HomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Box className="flex-1 overflow-auto">
        <Inquiry />
        <Banner />
        <TopStationsCarousel />
        <Divider />
      </Box>
    </Page>
  );
};

export default HomePage;

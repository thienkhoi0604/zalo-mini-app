import React from "react";
import { Box, Page } from "zmp-ui";
import { Inquiry } from "./inquiry";
import { Welcome } from "./welcome";
import { Banner } from "./banner";
import { TopStoresCarousel } from "./top-stores";
import { Divider } from "components/divider";

const HomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto">
        <Inquiry />
        <Banner />
        <TopStoresCarousel />
        <Divider />
      </Box>
    </Page>
  );
};

export default HomePage;

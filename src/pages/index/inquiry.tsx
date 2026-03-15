import React from "react";
import { FC } from "react";
import { Box, Input } from "zmp-ui";

export const Inquiry: FC = () => {
  return (
    <Box p={4} className="bg-white">
      <Input.Search
        placeholder="Tìm nhanh đồ uống, món mới ..."
        disabled
      />
    </Box>
  );
};

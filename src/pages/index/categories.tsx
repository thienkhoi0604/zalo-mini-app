import React from "react";
import { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useProductsStore } from "stores/products";

export const Categories: FC = () => {
  const categories = useProductsStore((s) => s.categories);

  return (
    <Box className="bg-white grid grid-cols-4 gap-4 p-4">
      {categories.map((category, i) => (
        <div
          key={i}
          className="flex flex-col space-y-2 items-center cursor-default"
        >
          <img className="w-12 h-12" src={category.icon} />
          <Text size="xxSmall" className="text-gray">
            {category.name}
          </Text>
        </div>
      ))}
    </Box>
  );
};

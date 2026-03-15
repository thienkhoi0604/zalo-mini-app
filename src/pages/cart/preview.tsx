import { DisplayPrice } from "components/display/price";
import React, { FC } from "react";
import { useCartStore } from "stores/cart";
import pay from "utils/product";
import { Box, Button, Text } from "zmp-ui";

export const CartPreview: FC = () => {
  const quantity = useCartStore((s) => s.totalQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice);

  return (
    <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-gray" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      <Button
        type="highlight"
        disabled={!quantity}
        fullWidth
        onClick={() => pay(totalPrice)}
      >
        Đặt hàng
      </Button>
    </Box>
  );
};

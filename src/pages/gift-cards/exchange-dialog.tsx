import React, { FC } from "react";
import { Box, Button, Modal, Text } from "zmp-ui";
import { GiftCard } from "@/types/gift-card";

interface Props {
  card: GiftCard;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ExchangeDialog: FC<Props> = ({
  card,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal
      visible
      onClose={onCancel}
      title="Xác Nhận Đổi Thẻ"
      closeOnMaskClick={!loading}
    >
      <Box className="p-4 space-y-4">
        <Box className="bg-gray-50 p-3 rounded-lg">
          <Text className="text-sm text-gray-600">Thẻ quà tặng</Text>
          <Text.Title className="text-base font-bold mt-1">
            {card.name}
          </Text.Title>
        </Box>

        <Box className="bg-orange-50 p-3 rounded-lg">
          <Text className="text-sm text-gray-600">Điểm sẽ bị trừ</Text>
          <Text.Title className="text-2xl font-bold text-orange-600 mt-1">
            -{card.pointsRequired} điểm
          </Text.Title>
        </Box>

        <Box className="bg-blue-50 p-3 rounded-lg">
          <Text className="text-sm text-blue-700">
            ℹ️ Thẻ quà tặng sẽ được thêm vào tài khoản của bạn ngay sau khi xác nhận
          </Text>
        </Box>

        <Box className="flex gap-2 pt-4">
          <Button
            onClick={onCancel}
            disabled={loading}
            fullWidth
            variant="secondary"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            fullWidth
            className="bg-orange-500 hover:bg-orange-600"
          >
            {loading ? "Đang xử lý..." : "Xác Nhận"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExchangeDialog;

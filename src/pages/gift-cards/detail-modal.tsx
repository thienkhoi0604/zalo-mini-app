import React, { FC, useState } from "react";
import { Box, Button, Sheet, Text, useSnackbar } from "zmp-ui";
import { GiftCard } from "@/types/gift-card";
import { useGiftCardsStore } from "stores/gift-cards";
import { useUserStore } from "stores/user";
import ExchangeDialog from "./exchange-dialog";

interface Props {
  card: GiftCard;
  onClose: () => void;
}

const DetailModal: FC<Props> = ({ card, onClose }) => {
  const { openSnackbar } = useSnackbar();
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const { redeemGiftCard, redeeming } = useGiftCardsStore();
  const { user } = useUserStore();

  const handleExchange = async () => {
    if (!user) {
      openSnackbar({
        text: "Vui lòng đăng nhập",
        type: "error",
      });
      return;
    }

    const currentPoints = user.points || 0;
    if (currentPoints < card.pointsRequired) {
      openSnackbar({
        text: `Bạn cần ${card.pointsRequired - currentPoints} điểm nữa`,
        type: "error",
      });
      return;
    }

    try {
      await redeemGiftCard(card.id);
      openSnackbar({
        text: "Đổi thành công! Thẻ quà tặng đã được thêm vào tài khoản",
        type: "success",
      });
      setShowExchangeDialog(false);
      onClose();
    } catch (error) {
      openSnackbar({
        text: "Không thể đổi thẻ quà tặng, vui lòng thử lại",
        type: "error",
      });
    }
  };

  const currentPoints = user?.points || 0;
  const canExchange = currentPoints >= card.pointsRequired;

  return (
    <>
      <Sheet onClose={onClose} mask>
        <Box className="p-4 pb-20">
          {/* Banner Image */}
          <img
            src={card.bannerImageUrl}
            alt={card.name}
            className="w-full h-48 rounded-lg object-cover mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x200?text=Card";
            }}
          />

          {/* Title and Category */}
          <Text.Title className="text-lg font-bold mb-1">
            {card.name}
          </Text.Title>
          <Text className="text-sm text-gray-500 mb-4">{card.category}</Text>

          {/* User Points Info */}
          {user && (
            <Box className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-4 border border-blue-200">
              <Text className="text-xs text-gray-600 mb-2">📊 Thông tin của bạn</Text>
              <Box className="flex gap-3">
                <Box className="flex-1">
                  <Text className="text-xs text-gray-500">Điểm tích lũy</Text>
                  <Text.Title className="text-lg font-bold text-orange-600">
                    {user.points || 0}
                  </Text.Title>
                </Box>
                <Box className="flex-1">
                  <Text className="text-xs text-gray-500">Điểm xếp hạng</Text>
                  <Text.Title className="text-lg font-bold text-blue-600">
                    {user.ratingPoints || 0}
                  </Text.Title>
                </Box>
              </Box>
            </Box>
          )}

          {/* Points Required */}
          <Box className="bg-orange-50 p-3 rounded-lg mb-4">
            <Text className="text-xs text-gray-600">Điểm cần để đổi</Text>
            <Text.Title className="text-2xl font-bold text-orange-600">
              {card.pointsRequired}
            </Text.Title>
            {user && (
              <Text className="text-xs text-gray-500 mt-1">
                Bạn có: <span className="font-bold text-gray-700">{currentPoints}</span> điểm
              </Text>
            )}
          </Box>

          {/* Description */}
          <Box className="mb-4">
            <Text.Title className="text-sm font-bold mb-2">Mô Tả</Text.Title>
            <Text className="text-sm text-gray-700">{card.description}</Text>
          </Box>

          {/* Applicable Time */}
          <Box className="mb-4">
            <Text.Title className="text-sm font-bold mb-2">
              Thời Gian Áp Dụng
            </Text.Title>
            <Text className="text-sm text-gray-700">
              Từ {new Date(card.applicableTimeStart).toLocaleDateString("vi-VN")} đến{" "}
              {new Date(card.applicableTimeEnd).toLocaleDateString("vi-VN")}
            </Text>
          </Box>

          {/* Usage Guide */}
          <Box className="mb-4">
            <Text.Title className="text-sm font-bold mb-2">
              Hướng Dẫn Sử Dụng
            </Text.Title>
            <Text className="text-sm text-gray-700">{card.usageGuide}</Text>
          </Box>

          {/* Program Notes */}
          <Box className="bg-yellow-50 p-3 rounded-lg mb-4">
            <Text.Title className="text-sm font-bold mb-2 text-yellow-800">
              ⚠️ Lưu Ý
            </Text.Title>
            <Text className="text-sm text-yellow-800">{card.programNotes}</Text>
          </Box>

          {/* Status Badge */}
          {card.status === "expired" && (
            <Box className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-sm text-red-600">
                Thẻ quà tặng này đã hết hạn
              </Text>
            </Box>
          )}

          {/* Exchange Button */}
          <Button
            onClick={() => setShowExchangeDialog(true)}
            disabled={!canExchange || card.status === "expired" || redeeming}
            fullWidth
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
          >
            {redeeming ? "Đang xử lý..." : "Đổi Thẻ"}
          </Button>
        </Box>
      </Sheet>

      {showExchangeDialog && (
        <ExchangeDialog
          card={card}
          onConfirm={handleExchange}
          onCancel={() => setShowExchangeDialog(false)}
          loading={redeeming}
        />
      )}
    </>
  );
};

export default DetailModal;

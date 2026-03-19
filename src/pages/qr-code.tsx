import React, { FC, useEffect, useState } from "react";
import { Box, Header, Button, Page } from "zmp-ui";
import { useUserStore } from "stores/user";
import { ImageSkeleton } from "components/skeletons";
import { useSnackbar } from "zmp-ui";

const QRCodePage: FC = () => {
  const { user, qrCodeUrl, qrLoading, loadQRCode, scanQRCode } = useUserStore();
  const { openSnackbar } = useSnackbar();
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadQRCode();
    }
  }, [user?.id]);

  // Mock QR Code URL generator
  const getMockQRUrl = () => {
    if (!user?.id) return "https://via.placeholder.com/300x300?text=QR+Code";
    // Using QR code API to generate QR code with user ID
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=userid:${user.id}`;
  };

  const handleScanQR = async () => {
    if (!user?.id) {
      openSnackbar({
        text: "Vui lòng đăng nhập để quét mã QR",
        type: "error",
      });
      return;
    }

    setScanLoading(true);
    try {
      // Dynamically import Zalo SDK to access scanQRCode function
      const zaloSdk = await import("zmp-sdk");

      // Check if scanQRCode function exists
      if (typeof zaloSdk.scanQRCode !== "function") {
        openSnackbar({
          text: "Tính năng quét QR chưa được hỗ trợ",
          type: "error",
        });
        setScanLoading(false);
        return;
      }

      const scanData = await zaloSdk.scanQRCode();

      if (!scanData) {
        setScanLoading(false);
        return; // User cancelled
      }

      // Extract user ID from QR data - expecting format like "userid:123"
      const qrString = (scanData as any)?.data || (scanData as any);
      const scannedUserId = qrString?.split(":")?.[1] || qrString;

      if (!scannedUserId) {
        openSnackbar({
          text: "Mã QR không hợp lệ",
          type: "error",
        });
        setScanLoading(false);
        return;
      }

      const points = await scanQRCode(scannedUserId);
      openSnackbar({
        text: `Kiếm được ${points} điểm!`,
        type: "success",
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message;

      if (errorMessage?.includes("already")) {
        openSnackbar({
          text: "Bạn đã quét mã người dùng này rồi",
          type: "error",
        });
      } else if (errorMessage?.includes("not found")) {
        openSnackbar({
          text: "Người dùng không tồn tại",
          type: "error",
        });
      } else {
        openSnackbar({
          text: errorMessage || "Có lỗi xảy ra khi quét mã QR",
          type: "error",
        });
      }
    } finally {
      setScanLoading(false);
    }
  };

  const mockQRUrl = getMockQRUrl();

  return (
    <Page className="bg-white">
      <Header showBackIcon={false} title="QR Code" />

      <Box className="flex flex-col p-4 space-y-6">
        {/* Scan QR Code Section - On Top */}
        <Box className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-lg font-semibold text-blue-900">📱 Quét mã QR</div>
          <div className="text-sm text-gray-700">
            Quét mã QR của người khác để kiếm điểm tích lũy
          </div>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={handleScanQR}
            loading={scanLoading}
          >
            {scanLoading ? "Đang quét..." : "Bắt đầu quét mã QR"}
          </Button>
        </Box>

        {/* My QR Code Section - Below */}
        <Box className="space-y-4">
          <div className="text-lg font-semibold">🎫 Thẻ QR Code của tôi</div>

          {qrLoading ? (
            <Box className="flex justify-center">
              <ImageSkeleton className="w-72 h-72 rounded-lg" />
            </Box>
          ) : (
            <Box className="flex justify-center">
              <Box className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-100">
                <img
                  src={mockQRUrl || qrCodeUrl}
                  alt="My QR Code"
                  className="w-64 h-64 rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x300?text=QR+Code";
                  }}
                />
              </Box>
            </Box>
          )}

          <Box className="text-center text-sm text-gray-500 mt-2">
            💡 Cho người khác quét mã này để họ kiếm điểm
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default QRCodePage;

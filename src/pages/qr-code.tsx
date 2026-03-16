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

  return (
    <Page className="bg-white">
      <Header title="QR Code" />

      <Box className="flex flex-col p-4 space-y-6">
        {/* My QR Code Section */}
        <Box className="space-y-4">
          <div className="text-lg font-semibold">Thẻ QR Code của tôi</div>

          {qrLoading ? (
            <Box className="flex justify-center">
              <ImageSkeleton className="w-64 h-64 rounded-lg" />
            </Box>
          ) : qrCodeUrl ? (
            <Box className="flex justify-center">
              <img
                src={qrCodeUrl}
                alt="My QR Code"
                className="w-64 h-64 rounded-lg border-2 border-gray-200"
              />
            </Box>
          ) : (
            <Box className="text-center text-gray-500 py-8">
              Không thể tải mã QR. Vui lòng thử lại.
            </Box>
          )}

          {/* User Info */}
          {user && (
            <Box className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên:</span>
                <span className="font-medium">{user.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Điểm:</span>
                <span className="font-semibold text-primary">
                  {user.points || 0}
                </span>
              </div>
            </Box>
          )}
        </Box>

        {/* Scan QR Code Section */}
        <Box className="space-y-4">
          <div className="text-lg font-semibold">Quét mã QR</div>
          <div className="text-sm text-gray-600">
            Quét mã QR của người khác để kiếm điểm
          </div>
          <Button
            className="w-full"
            onClick={handleScanQR}
            loading={scanLoading}
          >
            Quét mã QR
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default QRCodePage;

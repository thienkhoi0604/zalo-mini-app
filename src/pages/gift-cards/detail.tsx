import React, { FC, useEffect } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router-dom';
import { useGiftCardsStore } from 'stores/gift-cards';
import { useToBeImplemented } from 'hooks';

const GiftCardDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { allGiftCards, loadAllGiftCards } = useGiftCardsStore();
  const onBuy = useToBeImplemented();

  useEffect(() => {
    if (!allGiftCards.length) {
      loadAllGiftCards().catch(() => {
        openSnackbar({ text: 'Không thể tải thông tin thẻ', type: 'error' });
      });
    }
  }, []);

  const card = allGiftCards.find((c) => c.id === id);

  if (!card) {
    return (
      <Page className="flex-1 flex flex-col bg-gray-50 items-center justify-center">
        <p style={{ fontSize: 14, color: '#888' }}>
          Không tìm thấy thẻ quà tặng.
        </p>
      </Page>
    );
  }

  return (
    <Page className="flex-1 flex flex-col" style={{ background: '#F5F0E8' }}>
      {/* Hero */}
      <Box className="relative w-full flex-shrink-0" style={{ height: 240 }}>
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
          }}
        />
        <Box
          onClick={() => navigate(-1)}
          className="absolute flex items-center justify-center rounded-full bg-white shadow cursor-pointer"
          style={{ top: 16, left: 16, width: 36, height: 36, zIndex: 10 }}
        >
          <span style={{ fontSize: 20, color: '#1a1a1a', lineHeight: 1 }}>
            ‹
          </span>
        </Box>
      </Box>

      {/* Scrollable body */}
      <Box className="flex-1 overflow-y-auto" style={{ paddingBottom: 88 }}>
        {/* Main info */}
        <Box
          className="bg-white flex flex-col items-center px-6 py-5"
          style={{ gap: 6 }}
        >
          {card.brandLogoUrl && (
            <img
              src={card.brandLogoUrl}
              alt={card.brandName}
              className="rounded-xl object-cover"
              style={{ width: 60, height: 60, marginBottom: 4 }}
            />
          )}
          <p
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              lineHeight: '24px',
            }}
          >
            {card.name}
          </p>
          <Box flex className="items-center" style={{ gap: 6 }}>
            <span style={{ fontSize: 20 }}>🪙</span>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#C49A6C' }}>
              {card.pointsRequired}
            </p>
          </Box>
        </Box>

        {/* Stores */}
        {card.stores && card.stores.length > 0 && (
          <Box className="bg-white mt-3 px-4 py-4">
            <Box flex className="items-center justify-between mb-3">
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                Cửa hàng áp dụng ({card.stores.length})
              </p>
              <Box
                flex
                className="items-center cursor-pointer"
                style={{ gap: 3 }}
              >
                <p style={{ fontSize: 13, color: '#C49A6C', fontWeight: 600 }}>
                  Xem tất cả
                </p>
                <span style={{ color: '#C49A6C', fontSize: 15 }}>›</span>
              </Box>
            </Box>
            <Box className="flex flex-col" style={{ gap: 10 }}>
              {card.stores
                .slice(0, 3)
                .map((store: { address: string }, i: number) => (
                  <p
                    key={i}
                    style={{ fontSize: 13, color: '#555', lineHeight: '19px' }}
                  >
                    {store.address}
                  </p>
                ))}
            </Box>
          </Box>
        )}

        {/* Terms */}
        {card.terms && (
          <Box className="bg-white mt-3 px-4 py-4">
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: 10,
              }}
            >
              Điều khoản sử dụng
            </p>
            <p style={{ fontSize: 13, color: '#555', lineHeight: '21px' }}>
              {card.terms}
            </p>
          </Box>
        )}
      </Box>

      {/* Sticky buy button */}
      <Box
        className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white"
        style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}
      >
        <Box
          onClick={onBuy}
          className="w-full flex items-center justify-center rounded-2xl cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #C49A6C 0%, #A0784A 100%)',
            height: 52,
          }}
        >
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
            Mua Voucher
          </p>
        </Box>
      </Box>
    </Page>
  );
};

export default GiftCardDetailPage;

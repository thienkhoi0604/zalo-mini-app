import React, { FC, useEffect } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams } from 'react-router';
import { useRewardsStore } from 'stores/rewards';
import { useToBeImplemented } from 'hooks';

const RewardDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openSnackbar } = useSnackbar();
  const { allRewards, loadAllRewards } = useRewardsStore();
  const onBuy = useToBeImplemented();

  useEffect(() => {
    if (!allRewards.length) {
      loadAllRewards().catch(() => {
        openSnackbar({ text: 'Không thể tải thông tin thẻ', type: 'error' });
      });
    }
  }, []);

  const card = allRewards.find((c) => c.id === id);

  if (!card) {
    return (
      <Page className="flex-1 flex flex-col bg-gray-50 items-center justify-center">
        <p style={{ fontSize: 14, color: '#888' }}>
          Không tìm thấy phần thưởng.
        </p>
      </Page>
    );
  }

  return (
    <Page
      className="flex-1 flex flex-col"
      style={{ background: '#F5F0E8', position: 'relative' }}
    >
      {/* Scrollable body — padding bottom để tránh bị nút Mua đè */}
      <Box className="flex-1 overflow-y-auto" style={{ paddingBottom: 84 }}>
        {/* ── Hero image ── */}
        <Box
          style={{
            width: '100%',
            height: 220,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img
            src={card.bannerImageUrl || card.thumbnailImageUrl}
            alt={card.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
            }}
          />
        </Box>

        {/* ── Main info card ── */}
        <Box
          className="bg-white flex flex-col items-center"
          style={{
            margin: '12px 16px 0',
            borderRadius: 16,
            padding: '20px 20px 20px',
            gap: 8,
          }}
        >
          {/* Brand logo — square rounded */}
          {card.brandLogoUrl && (
            <img
              src={card.brandLogoUrl}
              alt={card.brandName}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                objectFit: 'cover',
                marginBottom: 4,
              }}
            />
          )}

          {/* Card name */}
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

          {/* Points */}
          <Box
            flex
            className="items-center justify-center"
            style={{ gap: 6, marginTop: 2 }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
              alt="coin"
              style={{ width: 24, height: 24 }}
            />
            <p style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
              {card.pointsRequired}
            </p>
          </Box>
        </Box>

        {/* ── Cửa hàng áp dụng ── */}
        {card.stores && card.stores.length > 0 && (
          <Box
            className="bg-white"
            style={{
              margin: '12px 16px 0',
              borderRadius: 16,
              padding: '16px 16px',
            }}
          >
            <Box
              flex
              className="items-center justify-between"
              style={{ marginBottom: 12 }}
            >
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                Cửa hàng áp dụng ({card.stores.length})
              </p>
              <Box
                flex
                className="items-center cursor-pointer"
                style={{ gap: 4 }}
              >
                <p style={{ fontSize: 13, color: '#C49A6C', fontWeight: 600 }}>
                  Xem tất cả
                </p>
                <span style={{ color: '#C49A6C', fontSize: 16, lineHeight: 1 }}>
                  →
                </span>
              </Box>
            </Box>

            <Box className="flex flex-col" style={{ gap: 12 }}>
              {card.stores
                .slice(0, 3)
                .map((store: { address: string }, i: number) => (
                  <p
                    key={i}
                    style={{ fontSize: 13, color: '#444', lineHeight: '19px' }}
                  >
                    {store.address}
                  </p>
                ))}
            </Box>
          </Box>
        )}

        {/* ── Điều khoản sử dụng ── */}
        {(card.terms || card.programNotes || card.usageGuide) && (
          <Box
            className="bg-white"
            style={{
              margin: '12px 16px 16px',
              borderRadius: 16,
              padding: '16px 16px',
            }}
          >
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
            <p style={{ fontSize: 13, color: '#444', lineHeight: '21px' }}>
              {card.terms || card.programNotes || card.usageGuide}
            </p>
          </Box>
        )}
      </Box>

      {/* ── Sticky buy button ── */}
      <Box
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 16px',
          background: '#fff',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
        }}
      >
        <Box
          onClick={onBuy}
          className="w-full flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #C8A97A 0%, #A07848 100%)',
            height: 52,
            borderRadius: 14,
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

export default RewardDetailPage;

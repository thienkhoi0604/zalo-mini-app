import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useUserStore } from '@/store/user';
import { fetchAppRanks } from '@/api/ranks';
import { buildTierConfig, resolveCurrentTier, TierConfig } from './tiers';
import HeroBanner from './hero-banner';
import ProgressSteps from './progress-steps';
import RankCard from './rank-card';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import RankMemberCard from './rank-member-card';
import bgVertical from '@/assets/images/background-profile-vertical.png';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: FC = () => (
  <Box className="px-4 pt-4 pb-8 flex flex-col gap-3">
    <Box className="animate-pulse rounded-3xl" style={{ aspectRatio: '3 / 4', width: '100%', background: 'rgba(255,255,255,0.12)' }} />
    <Box className="animate-pulse rounded-2xl" style={{ height: 160, background: 'rgba(255,255,255,0.12)' }} />
    <Box className="animate-pulse rounded-2xl" style={{ height: 80, background: 'rgba(255,255,255,0.12)' }} />
    {[1, 2, 3].map((i) => (
      <Box key={i} className="animate-pulse rounded-2xl" style={{ height: 120, background: 'rgba(255,255,255,0.12)' }} />
    ))}
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const RankBenefitsPage: FC = () => {
  const { user, pointWallet } = useUserStore();
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRanks = useCallback(async () => {
    setLoading(true);
    const ranks = await fetchAppRanks();
    const sorted = [...ranks]
      .filter((r) => r.isActive)
      .sort((a, b) => a.priority - b.priority)
      .map(buildTierConfig);
    setTiers(sorted);
    setLoading(false);
  }, []);

  useEffect(() => { loadRanks(); }, []);

  const currentTier = resolveCurrentTier(tiers, user?.rank?.currentRankCode, user?.rank?.currentRankName)
    ?? tiers[0];

  const currentIndex = tiers.findIndex((t) => t.code === currentTier?.code);

  return (
    <Page className="flex-1 flex flex-col overflow-hidden" style={{ position: 'relative' }}>
      {/* ── Full-screen background ── */}
      <img
        src={bgVertical}
        alt=""
        aria-hidden
        style={{
          position: 'fixed', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Dark overlay for content readability */}
      <Box
        className="pointer-events-none"
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(4, 10, 28, 0.72)',
          zIndex: 0,
        }}
      />

      <PullToRefresh onRefresh={loadRanks} className="flex-1" style={{ position: 'relative', zIndex: 1 }}>
        {loading ? (
          <Skeleton />
        ) : (
          <Box className="px-4 pt-4 pb-8 flex flex-col gap-4">
            {/* Membership card */}
            <RankMemberCard />

            {/* Stats banner */}
            {currentTier && (
              <HeroBanner tier={currentTier} pointWallet={pointWallet} />
            )}

            {/* Progress through tiers */}
            <ProgressSteps tiers={tiers} currentCode={currentTier?.code ?? ''} />

            {/* Section label */}
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                marginTop: 4,
              }}
            >
              Đặc quyền hạng
            </p>

            {/* Rank tier cards */}
            {tiers.map((tier, i) => (
              <RankCard
                key={tier.code}
                tier={tier}
                isCurrent={tier.code === currentTier?.code}
                isPast={i < currentIndex}
              />
            ))}
          </Box>
        )}
      </PullToRefresh>
    </Page>
  );
};

export default RankBenefitsPage;

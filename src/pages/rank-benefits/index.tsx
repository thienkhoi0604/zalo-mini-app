import React, { FC, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useUserStore } from '@/stores/user';
import { fetchAppRanks } from '@/apis/ranks';
import { buildTierConfig, resolveCurrentTier, TierConfig } from './tiers';
import HeroBanner from './hero-banner';
import ProgressSteps from './progress-steps';
import RankCard from './rank-card';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: FC = () => (
  <Box className="px-4 pt-4 pb-8 flex flex-col gap-3">
    <Box className="animate-pulse rounded-2xl" style={{ height: 160, background: '#E9EBED' }} />
    <Box className="animate-pulse rounded-2xl" style={{ height: 80, background: '#E9EBED' }} />
    {[1, 2, 3].map((i) => (
      <Box key={i} className="animate-pulse rounded-2xl" style={{ height: 120, background: '#E9EBED' }} />
    ))}
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const RankBenefitsPage: FC = () => {
  const { user, pointWallet } = useUserStore();
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppRanks().then((ranks) => {
      const sorted = [...ranks]
        .filter((r) => r.isActive)
        .sort((a, b) => a.priority - b.priority)
        .map(buildTierConfig);
      setTiers(sorted);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Page className="flex-1" style={{ background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)' }}>
        <Skeleton />
      </Page>
    );
  }

  const currentTier = resolveCurrentTier(tiers, user?.rank?.currentRankCode, user?.rank?.currentRankName)
    ?? tiers[0];

  const currentIndex = tiers.findIndex((t) => t.code === currentTier?.code);

  return (
    <Page className="flex-1" style={{ background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)' }}>
      <Box className="px-4 pt-4 pb-8 flex flex-col gap-3">
        {currentTier && (
          <HeroBanner tier={currentTier} pointWallet={pointWallet} />
        )}

        <ProgressSteps tiers={tiers} currentCode={currentTier?.code ?? ''} />

        <p className="text-xs font-bold text-gray-500 uppercase mt-2">Đặc quyền</p>

        {tiers.map((tier, i) => (
          <RankCard
            key={tier.code}
            tier={tier}
            isCurrent={tier.code === currentTier?.code}
            isPast={i < currentIndex}
          />
        ))}
      </Box>
    </Page>
  );
};

export default RankBenefitsPage;

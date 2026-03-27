import React, { FC } from 'react';
import { Box, Page } from 'zmp-ui';
import { useUserStore } from '@/stores/user';
import HeroBanner from './hero-banner';
import ProgressSteps from './progress-steps';
import RankCard from './rank-card';
import { RANK_TIERS, resolveCurrentTier } from './tiers';

const RankBenefitsPage: FC = () => {
  const { user, pointWallet } = useUserStore();
  const currentTier = resolveCurrentTier(user?.rank?.currentRankCode, user?.rank?.currentRankName);
  const currentCode = currentTier.code;
  const currentIndex = RANK_TIERS.findIndex((t) => t.code === currentCode);

  return (
    <Page className="flex-1" style={{ background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)' }}>
      <Box className="px-4 pt-4 pb-8 flex flex-col gap-3">
        <HeroBanner tier={currentTier} pointWallet={pointWallet} />
        <ProgressSteps currentCode={currentCode} />

        <p className="text-xs font-bold text-gray-500 uppercase mt-2">Đặc quyền</p>

        {RANK_TIERS.map((tier, i) => (
          <RankCard
            key={tier.code}
            tier={tier}
            isCurrent={tier.code === currentCode}
            isPast={i < currentIndex}
          />
        ))}
      </Box>
    </Page>
  );
};

export default RankBenefitsPage;

import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { Store } from 'lucide-react';
import { getStores, AppStore } from '@/api/stores';
import { StoreCard, StoreSkeleton } from '@/pages/vouchers/store-feed';
import SectionHeader from '@/components/ui/section-header';
import ViewAllFab from '@/components/ui/view-all-fab';

const MAX_STORES = 5;

export const TopStores: FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<AppStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores({ pageSize: MAX_STORES })
      .then((res) => setStores(res.items.slice(0, MAX_STORES)))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && stores.length === 0) return null;

  return (
    <Box className="py-4">
      <SectionHeader
        title="Cửa hàng"
        icon={<Store size={14} color="#fff" />}
        onViewAll={() => navigate('/stores')}
      />

      <Box
        flex
        style={{
          overflowX: 'auto',
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 4,
          gap: 10,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
        }}
      >
        {loading ? (
          [1, 2, 3].map((i) => <StoreSkeleton key={i} />)
        ) : (
          <>
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onCardClick={() => navigate(`/stores/${store.id}`)}
              />
            ))}
            {stores.length > 2 && <ViewAllFab onClick={() => navigate('/stores')} />}
          </>
        )}
      </Box>
    </Box>
  );
};

export default TopStores;

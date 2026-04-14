import React, { FC } from 'react';
import { Page } from 'zmp-ui';
import { Gift } from 'lucide-react';
import policyData from '@/assets/static/policy.json';
import CoinIcon from '@/components/ui/coin-icon';
import { useUserStore } from '@/store/user';

type PolicySection = (typeof policyData.sections)[number];

const SECTION_THEME: Record<string, { gradient: string }> = {
  la: { gradient: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)' },
  greencoin: { gradient: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)' },
  vouchers: { gradient: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)' },
};

/* ── Shared small components ─────────────────────────────────────────────── */

const BlockTitle: FC<{ label: string; color: string }> = ({ label, color }) => (
  <div
    style={{
      fontSize: 12,
      fontWeight: 700,
      color,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 10,
    }}
  >
    {label}
  </div>
);

const RuleCard: FC<{ label: string; content: string }> = ({
  label,
  content,
}) => (
  <div
    style={{
      background: '#F9FAFB',
      borderRadius: 12,
      padding: '10px 14px',
      borderLeft: '3px solid #E5E7EB',
      marginBottom: 8,
    }}
  >
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: '#374151',
        marginBottom: 3,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 12, color: '#6B7280', lineHeight: '18px' }}>
      {content}
    </div>
  </div>
);

const MethodItem: FC<{
  method: string;
  description: string;
  color: string;
}> = ({ method, description, color }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
      marginBottom: 10,
    }}
  >
    <div
      style={{
        width: 7,
        height: 7,
        minWidth: 7,
        borderRadius: '50%',
        background: color,
        marginTop: 5,
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
        {method}
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#6B7280',
          lineHeight: '17px',
          marginTop: 2,
        }}
      >
        {description}
      </div>
    </div>
  </div>
);

/* ── Section card wrapper ────────────────────────────────────────────────── */

const SectionCard: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      borderRadius: 20,
      boxShadow: '0 4px 20px rgba(40,143,78,0.15)',
      border: '1px solid rgba(40,143,78,0.1)',
      marginBottom: 16,
      background: '#fff',
      overflow: 'visible',
    }}
  >
    {children}
  </div>
);

const SectionHeader: FC<{ gradient: string; children: React.ReactNode }> = ({
  gradient,
  children,
}) => (
  <div
    style={{
      background: gradient,
      padding: '20px 20px 18px',
      borderRadius: '20px 20px 0 0',
    }}
  >
    {children}
  </div>
);

const SectionBody: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '16px 16px 20px' }}>{children}</div>
);

/* ── LÁ section ──────────────────────────────────────────────────────────── */

const LaSection: FC<{ section: PolicySection }> = ({ section }) => {
  const theme = SECTION_THEME.la;
  const rate = (section as any).exchange_rate;
  const methods: { method: string; description: string }[] =
    (section as any).earning_methods ?? [];
  const rules: { label: string; content: string }[] =
    (section as any).rules ?? [];

  return (
    <SectionCard>
      <SectionHeader gradient={theme.gradient}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
            {section.title}
          </div>
          <CoinIcon size={18} />
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: '16px' }}>
          {section.subtitle}
        </div>

        {rate && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 14,
              gap: 8,
              alignItems: 'center',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: '8px 14px',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {rate.value} {rate.unit}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              =
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FDE68A' }}>
              {rate.equivalent}
            </div>
          </div>
        )}
      </SectionHeader>

      <SectionBody>
        <div
          style={{
            fontSize: 13,
            color: '#374151',
            lineHeight: '20px',
            marginBottom: 16,
          }}
        >
          {section.description}
        </div>

        {methods.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <BlockTitle label="Cách tích LÁ" color="#288F4E" />
            {methods.map((m, i) => (
              <MethodItem
                key={i}
                method={m.method}
                description={m.description}
                color="#288F4E"
              />
            ))}
          </div>
        )}

        {rules.length > 0 && (
          <div>
            <BlockTitle label="Điều khoản" color="#288F4E" />
            {rules.map((r, i) => (
              <RuleCard key={i} label={r.label} content={r.content} />
            ))}
          </div>
        )}
      </SectionBody>
    </SectionCard>
  );
};

/* ── GREENCOIN section ───────────────────────────────────────────────────── */

const TIER_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  bronze: { bg: '#FEF3E2', color: '#92400E', border: '#FCD34D' },
  silver: { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
  gold: { bg: '#FFFBEB', color: '#B45309', border: '#FCD34D' },
  diamond: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
};

const GreenCoinSection: FC<{ section: PolicySection }> = ({ section }) => {
  const theme = SECTION_THEME.greencoin;
  const { user } = useUserStore();
  const rankIconUrl = user?.rank?.currentRankIconUrl;
  const features: { feature: string; description: string }[] =
    (section as any).features ?? [];
  const tiers: { rank: number; name: string; key: string }[] =
    (section as any).membership_tiers ?? [];
  const rules: { label: string; content: string }[] =
    (section as any).rules ?? [];

  return (
    <SectionCard>
      <SectionHeader gradient={theme.gradient}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
            {section.title}
          </div>
          {rankIconUrl && (
            <img src={rankIconUrl} alt="rank" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
          )}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: '16px' }}>
          {section.subtitle}
        </div>

        {tiers.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 14,
              gap: 6,
            }}
          >
            {tiers.map((t) => {
              const s = TIER_STYLE[t.key] ?? TIER_STYLE.bronze;
              return (
                <div
                  key={t.key}
                  style={{
                    flex: '1 1 0%',
                    minWidth: 60,
                    background: s.bg,
                    borderRadius: 10,
                    border: `1px solid ${s.border}`,
                    padding: '6px 4px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{ fontSize: 10, fontWeight: 700, color: s.color }}
                  >
                    {t.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionHeader>

      <SectionBody>
        <div
          style={{
            fontSize: 13,
            color: '#374151',
            lineHeight: '20px',
            marginBottom: 16,
          }}
        >
          {section.description}
        </div>

        {features.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <BlockTitle label="Tính năng" color="#288F4E" />
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: '#EEF7F1',
                  borderRadius: 12,
                  padding: '12px 14px',
                  border: '1px solid #A7F3D0',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1A6B38',
                    marginBottom: 4,
                  }}
                >
                  {f.feature}
                </div>
                <div
                  style={{ fontSize: 12, color: '#374151', lineHeight: '18px' }}
                >
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {rules.length > 0 && (
          <div>
            <BlockTitle label="Điều khoản" color="#288F4E" />
            {rules.map((r, i) => (
              <RuleCard key={i} label={r.label} content={r.content} />
            ))}
          </div>
        )}
      </SectionBody>
    </SectionCard>
  );
};

/* ── VOUCHERs section ────────────────────────────────────────────────────── */

type VoucherCategory = {
  id: string;
  name: string;
  examples: string;
  exchange_rate: { la: number; greencoin: number };
};

const VouchersSection: FC<{ section: PolicySection }> = ({ section }) => {
  const theme = SECTION_THEME.vouchers;
  const categories: VoucherCategory[] = (section as any).categories ?? [];

  return (
    <SectionCard>
      <SectionHeader gradient={theme.gradient}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
            {section.title}
          </div>
          <Gift size={22} color="#fff" />
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: '16px' }}>
          {section.subtitle}
        </div>
      </SectionHeader>

      <SectionBody>
        <div
          style={{
            fontSize: 13,
            color: '#374151',
            lineHeight: '20px',
            marginBottom: 16,
          }}
        >
          {section.description}
        </div>

        {categories.length > 0 && (
          <div>
            <BlockTitle label="Danh mục voucher" color="#288F4E" />
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  background: '#EEF7F1',
                  borderRadius: 12,
                  padding: '12px 14px',
                  border: '1px solid #A7F3D0',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#1A6B38',
                      marginBottom: 2,
                    }}
                  >
                    {cat.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#374151',
                      lineHeight: '16px',
                    }}
                  >
                    {cat.examples}
                  </div>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    background: '#D1FAE5',
                    borderRadius: 8,
                    padding: '4px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#1A6B38',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat.exchange_rate.la} LÁ → {cat.exchange_rate.greencoin} GREENCOIN
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionBody>
    </SectionCard>
  );
};

/* ── Page ─────────────────────────────────────────────────────────────────── */

const PolicyPage: FC = () => (
  <Page>
    <div
      style={{
        padding: '16px 16px 32px',
        background: '#F9FAFB',
      }}
    >

      {policyData.sections.map((section) => {
        if (section.id === 'la')
          return <LaSection key={section.id} section={section} />;
        if (section.id === 'greencoin')
          return <GreenCoinSection key={section.id} section={section} />;
        if (section.id === 'vouchers')
          return <VouchersSection key={section.id} section={section} />;
        return null;
      })}
    </div>
  </Page>
);

export default PolicyPage;

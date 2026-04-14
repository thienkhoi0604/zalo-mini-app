import React, { FC } from 'react';
import { Box, Page } from 'zmp-ui';
import { Gift, ArrowRightLeft, CheckCircle, Leaf } from 'lucide-react';
import policyData from '@/assets/static/policy.json';
import CoinIcon from '@/components/ui/coin-icon';
import memberCardImg from '@/assets/images/background-profile.png';

// ─── Types ────────────────────────────────────────────────────────────────────

type PolicySection = typeof policyData.sections[number];

// ─── Section header icons ─────────────────────────────────────────────────────

const SECTION_THEME: Record<string, { gradient: string; tagBg: string; tagColor: string }> = {
  la: {
    gradient: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)',
    tagBg: 'rgba(255,255,255,0.18)',
    tagColor: '#fff',
  },
  greencoin: {
    gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    tagBg: 'rgba(255,255,255,0.18)',
    tagColor: '#fff',
  },
  vouchers: {
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
    tagBg: 'rgba(255,255,255,0.18)',
    tagColor: '#fff',
  },
};

const SectionIcon: FC<{ id: string }> = ({ id }) => {
  if (id === 'la') {
    return (
      <Box
        style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Leaf size={28} color="#fff" fill="rgba(255,255,255,0.6)" strokeWidth={1.5} />
      </Box>
    );
  }
  if (id === 'greencoin') {
    return (
      <Box
        style={{
          width: 56, height: 56, borderRadius: 16, overflow: 'hidden',
          border: '1.5px solid rgba(255,255,255,0.35)',
          flexShrink: 0,
        }}
      >
        <img
          src={memberCardImg}
          alt="member card"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    );
  }
  // vouchers
  return (
    <Box
      style={{
        width: 56, height: 56, borderRadius: 16,
        background: 'rgba(255,255,255,0.18)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Gift size={28} color="#fff" />
    </Box>
  );
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const BlockTitle: FC<{ label: string; color: string }> = ({ label, color }) => (
  <p style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
    {label}
  </p>
);

const RuleCard: FC<{ label: string; content: string }> = ({ label, content }) => (
  <Box
    style={{
      background: '#F9FAFB', borderRadius: 12,
      padding: '10px 14px',
      borderLeft: '3px solid #E5E7EB',
    }}
  >
    <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 3 }}>{label}</p>
    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: '18px' }}>{content}</p>
  </Box>
);

const MethodItem: FC<{ method: string; description: string; color: string }> = ({ method, description, color }) => (
  <Box flex style={{ gap: 10, alignItems: 'flex-start' }}>
    <Box style={{ width: 7, height: 7, borderRadius: '50%', background: color, marginTop: 5, flexShrink: 0 }} />
    <Box style={{ flex: 1 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{method}</p>
      <p style={{ fontSize: 12, color: '#6B7280', lineHeight: '17px', marginTop: 2 }}>{description}</p>
    </Box>
  </Box>
);

// ─── LÁ section ───────────────────────────────────────────────────────────────

const LaSection: FC<{ section: PolicySection }> = ({ section }) => {
  const theme = SECTION_THEME.la;
  const rate = (section as any).exchange_rate;
  const methods: { method: string; description: string }[] = (section as any).earning_methods ?? [];
  const rules: { label: string; content: string }[] = (section as any).rules ?? [];

  return (
    <Box style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(40,143,78,0.15)', border: '1px solid rgba(40,143,78,0.1)' }}>
      {/* Header */}
      <Box style={{ background: theme.gradient, padding: '20px 20px 18px' }}>
        <Box flex style={{ gap: 14, alignItems: 'center' }}>
          <SectionIcon id="la" />
          <Box style={{ flex: 1 }}>
            <Box flex style={{ alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>{section.title}</p>
              <Box style={{ background: theme.tagBg, borderRadius: 100, padding: '2px 10px' }}>
                <CoinIcon size={13} />
              </Box>
            </Box>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: '16px' }}>{section.subtitle}</p>
          </Box>
        </Box>

        {/* Exchange rate pill */}
        {rate && (
          <Box
            flex
            style={{
              marginTop: 14, gap: 8, alignItems: 'center',
              background: 'rgba(255,255,255,0.15)', borderRadius: 12,
              padding: '8px 14px', border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <ArrowRightLeft size={14} color="rgba(255,255,255,0.8)" />
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {rate.value} {rate.unit}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>=</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#FDE68A' }}>{rate.equivalent}</p>
          </Box>
        )}
      </Box>

      {/* Body */}
      <Box style={{ background: '#fff', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Description */}
        <p style={{ fontSize: 13, color: '#374151', lineHeight: '20px' }}>{section.description}</p>

        {/* Earning methods */}
        {methods.length > 0 && (
          <Box>
            <BlockTitle label="Cách tích LÁ" color="#288F4E" />
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {methods.map((m, i) => (
                <MethodItem key={i} method={m.method} description={m.description} color="#288F4E" />
              ))}
            </Box>
          </Box>
        )}

        {/* Rules */}
        {rules.length > 0 && (
          <Box>
            <BlockTitle label="Điều khoản" color="#288F4E" />
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rules.map((r, i) => (
                <RuleCard key={i} label={r.label} content={r.content} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── GREENCOIN section ────────────────────────────────────────────────────────

const TIER_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  bronze:  { bg: '#FEF3E2', color: '#92400E', border: '#FCD34D' },
  silver:  { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
  gold:    { bg: '#FFFBEB', color: '#B45309', border: '#FCD34D' },
  diamond: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
};

const GreenCoinSection: FC<{ section: PolicySection }> = ({ section }) => {
  const theme = SECTION_THEME.greencoin;
  const features: { feature: string; description: string }[] = (section as any).features ?? [];
  const tiers: { rank: number; name: string; key: string }[] = (section as any).membership_tiers ?? [];
  const rules: { label: string; content: string }[] = (section as any).rules ?? [];

  return (
    <Box style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.1)' }}>
      {/* Header */}
      <Box style={{ background: theme.gradient, padding: '20px 20px 18px' }}>
        <Box flex style={{ gap: 14, alignItems: 'center' }}>
          <SectionIcon id="greencoin" />
          <Box style={{ flex: 1 }}>
            <Box flex style={{ alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>{section.title}</p>
            </Box>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: '16px' }}>{section.subtitle}</p>
          </Box>
        </Box>

        {/* Tier strip */}
        {tiers.length > 0 && (
          <Box flex style={{ marginTop: 14, gap: 6 }}>
            {tiers.map((t) => {
              const s = TIER_STYLE[t.key] ?? TIER_STYLE.bronze;
              return (
                <Box
                  key={t.key}
                  style={{
                    flex: 1, background: s.bg, borderRadius: 10,
                    border: `1px solid ${s.border}`,
                    padding: '6px 4px', textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{t.name}</p>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Body */}
      <Box style={{ background: '#fff', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: '20px' }}>{section.description}</p>

        {/* Features */}
        {features.length > 0 && (
          <Box>
            <BlockTitle label="Tính năng" color="#D97706" />
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {features.map((f, i) => (
                <Box key={i} style={{ background: '#FFFBEB', borderRadius: 12, padding: '12px 14px', border: '1px solid #FDE68A' }}>
                  <Box flex style={{ gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <CheckCircle size={14} color="#D97706" />
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>{f.feature}</p>
                  </Box>
                  <p style={{ fontSize: 12, color: '#78350F', lineHeight: '18px', paddingLeft: 22 }}>{f.description}</p>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Rules */}
        {rules.length > 0 && (
          <Box>
            <BlockTitle label="Điều khoản" color="#D97706" />
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rules.map((r, i) => (
                <RuleCard key={i} label={r.label} content={r.content} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── VOUCHERs section ─────────────────────────────────────────────────────────

type VoucherCategory = { id: string; name: string; examples: string; exchange_rate: { la: number; greencoin: number } };

const VouchersSection: FC<{ section: PolicySection }> = ({ section }) => {
  const theme = SECTION_THEME.vouchers;
  const categories: VoucherCategory[] = (section as any).categories ?? [];

  return (
    <Box style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.1)' }}>
      {/* Header */}
      <Box style={{ background: theme.gradient, padding: '20px 20px 18px' }}>
        <Box flex style={{ gap: 14, alignItems: 'center' }}>
          <SectionIcon id="vouchers" />
          <Box style={{ flex: 1 }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1, marginBottom: 4 }}>{section.title}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: '16px' }}>{section.subtitle}</p>
          </Box>
        </Box>
      </Box>

      {/* Body */}
      <Box style={{ background: '#fff', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: '20px' }}>{section.description}</p>

        {/* Categories */}
        {categories.length > 0 && (
          <Box>
            <BlockTitle label="Danh mục voucher" color="#6366F1" />
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories.map((cat) => (
                <Box
                  key={cat.id}
                  flex
                  style={{
                    background: '#F5F3FF', borderRadius: 12,
                    padding: '12px 14px', border: '1px solid #DDD6FE',
                    alignItems: 'flex-start', gap: 12,
                  }}
                >
                  <Box style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#4338CA', marginBottom: 2 }}>{cat.name}</p>
                    <p style={{ fontSize: 11, color: '#7C3AED', lineHeight: '16px' }}>{cat.examples}</p>
                  </Box>
                  {/* Exchange rate badge */}
                  <Box
                    style={{
                      flexShrink: 0,
                      background: '#EDE9FE', borderRadius: 8,
                      padding: '4px 8px', textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#4338CA', whiteSpace: 'nowrap' }}>
                      {cat.exchange_rate.la} LÁ → {cat.exchange_rate.greencoin} GC
                    </p>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const PolicyPage: FC = () => {
  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <Box style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Hero */}
        <Box
          style={{
            background: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)',
            borderRadius: 20, padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 4px 20px rgba(40,143,78,0.2)',
          }}
        >
          <Box
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Leaf size={24} color="#fff" fill="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          </Box>
          <Box>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
              Hệ sinh thái {policyData.ecosystem}
            </p>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: '22px' }}>
              Khái niệm & Điều khoản
            </p>
          </Box>
        </Box>

        {/* Sections */}
        {policyData.sections.map((section) => {
          if (section.id === 'la') return <LaSection key={section.id} section={section} />;
          if (section.id === 'greencoin') return <GreenCoinSection key={section.id} section={section} />;
          if (section.id === 'vouchers') return <VouchersSection key={section.id} section={section} />;
          return null;
        })}
      </Box>
    </Page>
  );
};

export default PolicyPage;

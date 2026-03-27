import React, { FC, useMemo, useRef } from 'react';
import { Box } from 'zmp-ui';
import { Search, X, ChevronDown } from 'lucide-react';
import { useStationsStore, StationFilters } from '@/stores/stations';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// ─── Native Select ────────────────────────────────────────────────────────────

const NativeSelect: FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}> = ({ value, onChange, placeholder, options }) => (
  <Box
    className="relative flex items-center rounded-xl overflow-hidden flex-1"
    style={{
      background: value ? '#EEF7F1' : '#F3F4F6',
      border: `1.5px solid ${value ? '#86EFAC' : '#E5E7EB'}`,
      height: 40,
      minWidth: 0,
    }}
  >
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        height: '100%',
        paddingLeft: 12,
        paddingRight: 28,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: 13,
        color: value ? '#1A6B38' : '#6B7280',
        fontWeight: value ? 600 : 400,
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <Box
      className="absolute pointer-events-none flex-shrink-0"
      style={{ right: 8, top: '50%', transform: 'translateY(-50%)' }}
    >
      <ChevronDown size={14} color={value ? '#288F4E' : '#9CA3AF'} />
    </Box>
  </Box>
);

// ─── Search Filter Bar ────────────────────────────────────────────────────────

const SearchFilter: FC = () => {
  const { search, provinceCode, wardCode, allForFilter, setFilters } = useStationsStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const provinces = useMemo(
    () =>
      unique(allForFilter.map((s) => s.provinceCode))
        .filter(Boolean)
        .map((code) => ({
          value: code,
          label: allForFilter.find((s) => s.provinceCode === code)?.provinceName ?? code,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'vi')),
    [allForFilter],
  );

  const wards = useMemo(
    () =>
      unique(
        allForFilter
          .filter((s) => !provinceCode || s.provinceCode === provinceCode)
          .map((s) => s.wardCode),
      )
        .filter(Boolean)
        .map((code) => ({
          value: code,
          label:
            allForFilter.find((s) => s.wardCode === code)?.wardName ?? code,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'vi')),
    [allForFilter, provinceCode],
  );

  const hasFilters = search || provinceCode || wardCode;

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters({ search: value });
    }, 350);
  };

  const handleClearAll = () => {
    setFilters({ search: '', provinceCode: '', wardCode: '' });
  };

  return (
    <Box
      className="bg-white"
      style={{
        borderBottom: '1px solid #F0F0F0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Search input */}
      <Box
        flex
        className="items-center rounded-xl overflow-hidden"
        style={{
          background: '#F3F4F6',
          border: `1.5px solid ${search ? '#86EFAC' : 'transparent'}`,
          height: 42,
          gap: 8,
          paddingLeft: 12,
          paddingRight: 8,
          transition: 'border-color 0.2s',
        }}
      >
        <Search size={16} color={search ? '#288F4E' : '#9CA3AF'} style={{ flexShrink: 0 }} />
        <input
          type="text"
          defaultValue={search}
          placeholder="Tìm theo tên trạm, địa chỉ..."
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: 13,
            color: '#111827',
            outline: 'none',
          }}
        />
        {search && (
          <button
            onClick={() => {
              if (debounceRef.current) clearTimeout(debounceRef.current);
              setFilters({ search: '' });
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
          >
            <X size={14} color="#9CA3AF" />
          </button>
        )}
      </Box>

      {/* Province + Ward row */}
      <Box flex style={{ gap: 8 }}>
        <NativeSelect
          value={provinceCode}
          onChange={(v) => setFilters({ provinceCode: v })}
          placeholder="Tỉnh / Thành phố"
          options={provinces}
        />
        <NativeSelect
          value={wardCode}
          onChange={(v) => setFilters({ wardCode: v })}
          placeholder="Phường / Xã"
          options={wards}
        />
      </Box>

      {/* Clear all filters */}
      {hasFilters && (
        <button
          onClick={handleClearAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 0',
          }}
        >
          <X size={12} color="#EF4444" />
          <p style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Xoá bộ lọc</p>
        </button>
      )}
    </Box>
  );
};

export default SearchFilter;

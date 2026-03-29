import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from 'zmp-ui';
import { Search, X, ChevronDown, MapPin, Building2, SlidersHorizontal } from 'lucide-react';
import { useStationsStore } from '@/stores/stations';

// ─── Native Select ────────────────────────────────────────────────────────────

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  loading?: boolean;
  icon: React.ReactNode;
  activeIconBg: string;
  activeColor: string;
  activeBorder: string;
  activeBg: string;
}

const NativeSelect: FC<SelectProps> = ({
  value, onChange, onClear, label, placeholder, options,
  disabled, loading, icon, activeIconBg, activeColor, activeBorder, activeBg,
}) => {
  const isActive = !!value;
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  return (
    <Box className="flex-1" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* Label row */}
      <Box flex className="items-center" style={{ gap: 5, paddingLeft: 2 }}>
        <Box
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            background: isActive ? activeIconBg : '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          {icon}
        </Box>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: isActive ? activeColor : '#9CA3AF',
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
        >
          {label}
        </p>
        {isActive && (
          <Box
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: activeColor,
              marginLeft: 1,
            }}
          />
        )}
      </Box>

      {/* Select wrapper */}
      <Box
        className="relative flex items-center"
        style={{
          background: isActive ? activeBg : '#F9FAFB',
          border: `1.5px solid ${isActive ? activeBorder : '#E5E7EB'}`,
          borderRadius: 12,
          height: 44,
          minWidth: 0,
          opacity: disabled ? 0.45 : 1,
          transition: 'border-color 0.2s, background 0.2s',
          overflow: 'hidden',
          boxShadow: isActive ? `0 2px 8px ${activeBorder}44` : 'none',
        }}
      >
        {/* Selected value display / placeholder */}
        <p
          style={{
            position: 'absolute',
            left: 11,
            right: isActive ? 46 : 28,
            fontSize: 12,
            fontWeight: isActive ? 700 : 400,
            color: isActive ? activeColor : '#9CA3AF',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
            transition: 'color 0.2s',
          }}
        >
          {isActive ? selectedLabel : placeholder}
        </p>

        {/* Invisible native select for interaction */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Right side: clear button or chevron/spinner */}
        <Box
          className="absolute flex items-center justify-center"
          style={{ right: 0, top: 0, bottom: 0, width: 36, gap: 2, pointerEvents: isActive ? 'auto' : 'none' }}
        >
          {loading ? (
            <Box
              className="animate-spin"
              style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: activeColor }}
            />
          ) : isActive ? (
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: activeBorder,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <X size={10} color="#fff" strokeWidth={2.5} />
            </button>
          ) : (
            <ChevronDown size={14} color="#C4C4C4" />
          )}
        </Box>
      </Box>
    </Box>
  );
};

// ─── Search Filter Bar ────────────────────────────────────────────────────────

const SearchFilter: FC = () => {
  const {
    search, provinceCode, wardCode,
    provinces, wards, wardsLoading,
    setFilters, loadProvinces,
  } = useStationsStore();

  const [inputValue, setInputValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { loadProvinces(); }, []);

  const provinceOptions = useMemo(
    () => provinces.map((p) => ({ value: p.code, label: p.name })),
    [provinces],
  );

  const wardOptions = useMemo(
    () => wards.map((w) => ({ value: w.code, label: w.name })),
    [wards],
  );

  const activeFilterCount = [inputValue, provinceCode, wardCode].filter(Boolean).length;

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFilters({ search: value }), 350);
  };

  const handleClearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue('');
    setFilters({ search: '' });
  };

  const handleClearAll = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue('');
    setFilters({ search: '', provinceCode: '', wardCode: '' });
  };

  return (
    <Box
      className="bg-white"
      style={{
        borderBottom: '1px solid #EFEFEF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        padding: '12px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header row */}
      <Box flex className="items-center justify-between">
        <Box flex className="items-center" style={{ gap: 7 }}>
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #43B96B, #288F4E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SlidersHorizontal size={13} color="#fff" />
          </Box>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Bộ lọc</p>
          {activeFilterCount > 0 && (
            <Box
              style={{
                background: '#288F4E',
                borderRadius: 100,
                padding: '1px 7px',
                minWidth: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>{activeFilterCount}</p>
            </Box>
          )}
        </Box>

        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 20,
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            <X size={11} color="#EF4444" strokeWidth={2.5} />
            <p style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>Xoá tất cả</p>
          </button>
        )}
      </Box>

      {/* Search input */}
      <Box
        flex
        className="items-center"
        style={{
          background: inputValue ? '#F0FDF4' : '#F9FAFB',
          border: `1.5px solid ${inputValue ? '#86EFAC' : '#E5E7EB'}`,
          borderRadius: 12,
          height: 44,
          gap: 8,
          paddingLeft: 12,
          paddingRight: 8,
          transition: 'border-color 0.2s, background 0.2s',
          boxShadow: inputValue ? '0 2px 8px rgba(134,239,172,0.3)' : 'none',
        }}
      >
        <Search size={15} color={inputValue ? '#288F4E' : '#C4C4C4'} style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={inputValue}
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
        {inputValue && (
          <button
            onClick={handleClearSearch}
            style={{
              background: '#D1D5DB',
              border: 'none',
              borderRadius: '50%',
              width: 18,
              height: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <X size={10} color="#fff" strokeWidth={2.5} />
          </button>
        )}
      </Box>

      {/* Province + Ward */}
      <Box flex style={{ gap: 10 }}>
        <NativeSelect
          value={provinceCode}
          onChange={(v) => setFilters({ provinceCode: v })}
          onClear={() => setFilters({ provinceCode: '', wardCode: '' })}
          label="Tỉnh / Thành phố"
          placeholder="Chọn tỉnh thành"
          options={provinceOptions}
          icon={<MapPin size={9} color={provinceCode ? '#288F4E' : '#9CA3AF'} />}
          activeIconBg="#DCFCE7"
          activeColor="#166534"
          activeBorder="#86EFAC"
          activeBg="#F0FDF4"
        />
        <NativeSelect
          value={wardCode}
          onChange={(v) => setFilters({ wardCode: v })}
          onClear={() => setFilters({ wardCode: '' })}
          label="Phường / Xã"
          placeholder={wardsLoading ? 'Đang tải...' : 'Chọn phường xã'}
          options={wardOptions}
          disabled={!provinceCode}
          loading={wardsLoading}
          icon={<Building2 size={9} color={wardCode ? '#7C3AED' : '#9CA3AF'} />}
          activeIconBg="#EDE9FE"
          activeColor="#5B21B6"
          activeBorder="#A78BFA"
          activeBg="#F5F3FF"
        />
      </Box>
    </Box>
  );
};

export default SearchFilter;

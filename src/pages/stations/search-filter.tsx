import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from 'zmp-ui';
import { Search, X, ChevronDown, MapPin, Building2, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { useStationsStore } from '@/store/stations';
import { Sheet } from '@/components/ui/sheet';

// ─── Picker Sheet ─────────────────────────────────────────────────────────────

interface PickerSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
  icon: React.ReactNode;
  activeColor: string;
}

const PickerSheet: FC<PickerSheetProps> = ({
  visible, onClose, title, options, value, onSelect, icon, activeColor,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => query.trim()
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options,
    [options, query],
  );

  // reset search when sheet closes
  useEffect(() => {
    if (!visible) setQuery('');
  }, [visible]);

  return (
    <Sheet visible={visible} onClose={onClose} height={88} swipeToClose>
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Handle + title */}
        <Box style={{ padding: '4px 20px 14px', borderBottom: '1px solid #F3F4F6' }}>
          <Box flex className="items-center justify-center" style={{ gap: 8 }}>
            {icon}
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{title}</p>
          </Box>
        </Box>

        {/* Search */}
        <Box style={{ padding: '12px 16px 8px' }}>
          <Box
            flex
            className="items-center"
            style={{
              background: '#F3F4F6',
              borderRadius: 12,
              height: 40,
              paddingLeft: 12,
              paddingRight: 12,
              gap: 8,
            }}
          >
            <Search size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: 13,
                color: '#111827',
                outline: 'none',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  background: '#D1D5DB',
                  border: 'none',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <X size={9} color="#fff" strokeWidth={3} />
              </button>
            )}
          </Box>
        </Box>

        {/* Options list */}
        <Box style={{ flex: 1, overflowY: 'auto', paddingBottom: 'calc(16px + var(--zaui-safe-area-inset-bottom, 0px))' }}>
          {filtered.length === 0 ? (
            <Box flex className="items-center justify-center" style={{ paddingTop: 32, paddingBottom: 32 }}>
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>Không có kết quả</p>
            </Box>
          ) : (
            filtered.map((o, i) => {
              const selected = o.value === value;
              return (
                <Box
                  key={o.value}
                  onClick={() => { onSelect(o.value); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 20px',
                    background: selected ? '#F0FDF4' : 'transparent',
                    borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <p style={{
                    fontSize: 14,
                    fontWeight: selected ? 600 : 400,
                    color: selected ? activeColor : '#374151',
                  }}>
                    {o.label}
                  </p>
                  {selected && <CheckCircle2 size={18} color={activeColor} />}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Sheet>
  );
};

// ─── Select Trigger ───────────────────────────────────────────────────────────

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
  const [open, setOpen] = useState(false);
  const isActive = !!value;
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  return (
    <>
      <Box className="flex-1" style={{ minWidth: 0 }}>
        <Box
          className="relative flex items-center"
          onClick={() => { if (!disabled && !loading) setOpen(true); }}
          style={{
            background: isActive ? activeBg : '#F8FAFC',
            border: `1.5px solid ${isActive ? activeBorder : '#E8ECF0'}`,
            borderRadius: 16,
            height: 54,
            minWidth: 0,
            opacity: disabled ? 0.42 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
            overflow: 'hidden',
            boxShadow: isActive
              ? `0 4px 14px ${activeBorder}50, inset 0 1px 0 rgba(255,255,255,0.85)`
              : 'inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Left icon bubble */}
          <Box
            style={{
              position: 'absolute',
              left: 10,
              width: 28,
              height: 28,
              borderRadius: 9,
              background: isActive ? activeIconBg : '#ECEEF1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.25s',
              boxShadow: isActive ? `0 2px 6px ${activeBorder}40` : 'none',
            }}
          >
            {icon}
          </Box>

          {/* Floating label + value stacked */}
          <Box
            style={{
              position: 'absolute',
              left: 46,
              right: isActive ? 46 : 30,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
              pointerEvents: 'none',
            }}
          >
            <p style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: isActive ? activeColor : '#A0AAB4',
              lineHeight: 1,
            }}>
              {label}
            </p>
            <p style={{
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#111827' : '#B8BEC6',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
            }}>
              {isActive ? selectedLabel : placeholder}
            </p>
          </Box>

          {/* Right: clear / chevron / spinner */}
          <Box
            className="absolute flex items-center justify-center"
            style={{ right: 8, top: 0, bottom: 0, width: 32 }}
          >
            {loading ? (
              <Box
                className="animate-spin"
                style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: activeColor }}
              />
            ) : isActive ? (
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: activeBorder,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 2px 6px ${activeBorder}70`,
                }}
              >
                <X size={10} color="#fff" strokeWidth={3} />
              </button>
            ) : (
              <Box style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                background: '#E8ECF0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ChevronDown size={12} color="#9CA3AF" />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <PickerSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={label}
        options={options}
        value={value}
        onSelect={onChange}
        icon={icon}
        activeColor={activeColor}
      />
    </>
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

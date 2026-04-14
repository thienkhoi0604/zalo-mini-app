import React, { FC, useRef } from 'react';
import { Box } from 'zmp-ui';
import { ImagePlus, X, CheckCircle, Loader } from 'lucide-react';

interface Props {
  imageUrl: string | null;
  uploading?: boolean;
  uploaded?: boolean;
  onChange: (file: File) => void;
  onClear: () => void;
}

const ImagePicker: FC<Props> = ({ imageUrl, uploading = false, uploaded = false, onChange, onClear }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
    e.target.value = '';
  };

  if (imageUrl) {
    return (
      <Box className="relative rounded-2xl overflow-hidden" style={{ height: 200 }}>
        <img
          src={imageUrl}
          alt="Ảnh xe"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Overlay gradient */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.3))',
          }}
        />

        {/* Uploading overlay */}
        {uploading && (
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Loader size={28} color="#fff" className="animate-spin" />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Đang tải lên...</p>
          </Box>
        )}

        {/* Upload success badge */}
        {uploaded && !uploading && (
          <Box
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(40,143,78,0.85)',
              borderRadius: 100,
              padding: '4px 10px',
            }}
          >
            <CheckCircle size={12} color="#fff" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Đã tải lên</span>
          </Box>
        )}

        {/* Clear button — disabled while uploading */}
        {!uploading && (
          <button
            onClick={onClear}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} color="#fff" />
          </button>
        )}

        {/* Change image — disabled while uploading */}
        {!uploading && (
          <Box
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}
          >
            <span
              onClick={() => fileRef.current?.click()}
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 100,
                padding: '4px 14px',
              }}
            >
              Đổi ảnh
            </span>
          </Box>
        )}

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button
        onClick={() => fileRef.current?.click()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: '#F9FAFB',
          border: '2px dashed #E5E7EB',
          borderRadius: 16,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        <Box
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 44, height: 44, background: '#F3F4F6' }}
        >
          <ImagePlus size={22} color="#6B7280" />
        </Box>
        <Box style={{ textAlign: 'left' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Chọn từ thư viện</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>Ảnh xe rõ ràng, đủ biển số</p>
        </Box>
      </button>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </Box>
  );
};

export default ImagePicker;

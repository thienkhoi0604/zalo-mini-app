import React, { FC, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { ShieldCheck, Car } from 'lucide-react';
import { uploadImage } from '@/api/upload';
import { verifyVehicle } from '@/api/user';
import { useUserStore } from '@/store/user';
import VehicleTypeSelector from './vehicle-type-selector';
import ImagePicker from './image-picker';

// ─── Section wrapper ───────────────────────────────────────────────────────────

const Section: FC<{ step: number; title: string; children: React.ReactNode }> = ({ step, title, children }) => (
  <Box
    className="bg-white rounded-2xl overflow-hidden"
    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
  >
    <Box
      flex
      className="items-center"
      style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', gap: 10 }}
    >
      <Box
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{
          width: 26,
          height: 26,
          background: 'linear-gradient(135deg, #43B96B, #1A6B38)',
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{step}</p>
      </Box>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{title}</p>
    </Box>
    <Box style={{ padding: '16px' }}>{children}</Box>
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const VerifyVehiclePage: FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleTypeId, setVehicleTypeId] = useState('');

  // Image 1: preview (local blob) + uploaded server URL + uploading flag
  const [previewUrl1, setPreviewUrl1] = useState<string | null>(null);
  const [uploadedUrl1, setUploadedUrl1] = useState<string | null>(null);
  const [uploading1, setUploading1] = useState(false);

  // Image 2: preview (local blob) + uploaded server URL + uploading flag
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const [uploadedUrl2, setUploadedUrl2] = useState<string | null>(null);
  const [uploading2, setUploading2] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleImageChange1 = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl1(localUrl);
    setUploadedUrl1(null);
    setUploading1(true);
    try {
      const url = await uploadImage(file);
      setUploadedUrl1(url);
    } catch {
      openSnackbar({ text: 'Tải ảnh lên thất bại. Vui lòng thử lại.', type: 'error' });
      URL.revokeObjectURL(localUrl);
      setPreviewUrl1(null);
    } finally {
      setUploading1(false);
    }
  };

  const handleClearImage1 = () => {
    if (previewUrl1) URL.revokeObjectURL(previewUrl1);
    setPreviewUrl1(null);
    setUploadedUrl1(null);
  };

  const handleImageChange2 = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl2(localUrl);
    setUploadedUrl2(null);
    setUploading2(true);
    try {
      const url = await uploadImage(file);
      setUploadedUrl2(url);
    } catch {
      openSnackbar({ text: 'Tải ảnh lên thất bại. Vui lòng thử lại.', type: 'error' });
      URL.revokeObjectURL(localUrl);
      setPreviewUrl2(null);
    } finally {
      setUploading2(false);
    }
  };

  const handleClearImage2 = () => {
    if (previewUrl2) URL.revokeObjectURL(previewUrl2);
    setPreviewUrl2(null);
    setUploadedUrl2(null);
  };

  // Valid when: license plate ok, image 1 fully uploaded, no upload in progress
  const isValid =
    licensePlate.trim().length >= 6 &&
    !!vehicleTypeId &&
    !!uploadedUrl1 &&
    !uploading1 &&
    !uploading2;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      await verifyVehicle({
        vehicleTypeId,
        licensePlate: licensePlate.trim().toUpperCase(),
        photoUrl1: uploadedUrl1!,
        ...(uploadedUrl2 ? { photoUrl2: uploadedUrl2 } : {}),
      });
      openSnackbar({
        text: 'Gửi yêu cầu xác thực thành công! Chúng tôi sẽ xem xét trong 1–2 ngày làm việc.',
        type: 'success',
      });
      navigate(-1);
    } catch {
      openSnackbar({ text: 'Gửi yêu cầu thất bại. Vui lòng thử lại.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page className="flex-1 flex flex-col">
      <Box className="flex-1 overflow-auto">

        {/* Hero banner */}
        <Box
          style={{
            background: 'linear-gradient(135deg, #2FA85F 0%, #1A6B38 100%)',
            padding: '24px 20px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <Box style={{ position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <Box style={{ position: 'absolute', bottom: -16, left: -16, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <Box flex className="items-center" style={{ gap: 14 }}>
            <Box
              className="flex items-center justify-center rounded-2xl flex-shrink-0"
              style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              <ShieldCheck size={28} color="#fff" />
            </Box>
            <Box>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: '24px' }}>
                Xác thực xe điện
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, lineHeight: '18px' }}>
                Xác thực để mở khóa toàn bộ tính năng tích điểm
              </p>
            </Box>
          </Box>

          {/* Steps indicator */}
          <Box flex className="items-center" style={{ marginTop: 20, gap: 6 }}>
            {['Biển số', 'Loại xe', 'Ảnh xe'].map((label, i) => (
              <React.Fragment key={label}>
                <Box flex className="items-center" style={{ gap: 5 }}>
                  <Box
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.9)' }}
                  >
                    <p style={{ fontSize: 10, fontWeight: 800, color: '#1A6B38' }}>{i + 1}</p>
                  </Box>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{label}</p>
                </Box>
                {i < 2 && (
                  <Box style={{ flex: 1, height: 1.5, background: 'rgba(255,255,255,0.35)', borderRadius: 99 }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* Form */}
        <Box style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Step 1: License plate */}
          <Section step={1} title="Biển số xe">
            <Box>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                Nhập biển số xe đúng định dạng (VD: 51A-12345)
              </p>
              <Box
                flex
                className="items-center rounded-xl overflow-hidden"
                style={{
                  border: `2px solid ${licensePlate.length >= 6 ? '#288F4E' : '#E5E7EB'}`,
                  background: '#F9FAFB',
                  transition: 'border-color 0.2s',
                }}
              >
                <Box
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 48, height: 52, background: '#F3F4F6', borderRight: '1.5px solid #E5E7EB' }}
                >
                  <Car size={20} color="#6B7280" />
                </Box>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="51A-12345"
                  maxLength={12}
                  style={{
                    flex: 1,
                    padding: '0 14px',
                    height: 52,
                    border: 'none',
                    background: 'transparent',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#111827',
                    letterSpacing: 1.5,
                    outline: 'none',
                    textTransform: 'uppercase',
                  }}
                />
                {licensePlate.length >= 6 && (
                  <Box
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ paddingRight: 14 }}
                  >
                    <span style={{ fontSize: 18 }}>✅</span>
                  </Box>
                )}
              </Box>
            </Box>
          </Section>

          {/* Step 2: Vehicle type */}
          <Section step={2} title="Loại phương tiện">
            <VehicleTypeSelector value={vehicleTypeId} onChange={setVehicleTypeId} />
          </Section>

          {/* Step 3: Images */}
          <Section step={3} title="Ảnh xe">
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Box>
                <Box flex className="items-center" style={{ gap: 6, marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Ảnh 1</p>
                  <Box style={{ background: '#EEF7F1', borderRadius: 100, padding: '2px 8px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#288F4E' }}>Bắt buộc</p>
                  </Box>
                </Box>
                <ImagePicker
                  imageUrl={previewUrl1}
                  uploading={uploading1}
                  uploaded={!!uploadedUrl1}
                  onChange={handleImageChange1}
                  onClear={handleClearImage1}
                />
              </Box>

              <Box style={{ height: 1, background: '#F3F4F6' }} />

              <Box>
                <Box flex className="items-center" style={{ gap: 6, marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Ảnh 2</p>
                  <Box style={{ background: '#F3F4F6', borderRadius: 100, padding: '2px 8px' }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#6B7280' }}>Tuỳ chọn</p>
                  </Box>
                </Box>
                <ImagePicker
                  imageUrl={previewUrl2}
                  uploading={uploading2}
                  uploaded={!!uploadedUrl2}
                  onChange={handleImageChange2}
                  onClear={handleClearImage2}
                />
              </Box>
            </Box>
          </Section>

          {/* Notice */}
          <Box
            flex
            className="items-start rounded-2xl"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '14px 16px', gap: 10 }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <p style={{ fontSize: 12, color: '#92400E', lineHeight: '18px' }}>
              Thông tin xác thực sẽ được xem xét trong <strong>1–2 ngày làm việc</strong>. Bạn sẽ nhận thông báo khi được phê duyệt.
            </p>
          </Box>
        </Box>
      </Box>

      {/* Sticky CTA */}
      <Box
        style={{
          flexShrink: 0,
          padding: '12px 16px',
          background: '#fff',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          style={{
            width: '100%',
            height: 52,
            borderRadius: 16,
            border: 'none',
            cursor: isValid && !submitting ? 'pointer' : 'not-allowed',
            background: isValid && !submitting
              ? 'linear-gradient(135deg, #2FA85F, #1A6B38)'
              : '#E5E7EB',
            color: isValid && !submitting ? '#fff' : '#9CA3AF',
            fontSize: 15,
            fontWeight: 700,
            transition: 'all 0.2s',
            boxShadow: isValid && !submitting ? '0 4px 16px rgba(40,143,78,0.35)' : 'none',
          }}
        >
          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu xác thực'}
        </button>
      </Box>
    </Page>
  );
};

export default VerifyVehiclePage;

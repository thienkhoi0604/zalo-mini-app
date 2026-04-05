import React, { FC } from 'react';
import { LayoutGrid } from 'lucide-react';

interface ViewAllFabProps {
  onClick: () => void;
}

const ViewAllFab: FC<ViewAllFabProps> = ({ onClick }) => (
  <div
    className="flex-shrink-0 cursor-pointer"
    style={{
      width: 64,
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}
    onClick={onClick}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: '#288F4E',
        boxShadow: '0 4px 16px rgba(40,143,78,0.28), 0 1px 4px rgba(40,143,78,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <LayoutGrid size={18} color="#fff" strokeWidth={2} />
    </div>
    <p style={{ fontSize: 10, fontWeight: 700, color: '#288F4E', letterSpacing: 0.3, textAlign: 'center' }}>
      Tất cả
    </p>
  </div>
);

export default ViewAllFab;

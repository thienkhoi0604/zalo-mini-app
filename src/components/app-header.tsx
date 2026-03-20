import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from 'zmp-ui';
import { useUserStore } from 'stores/user';

type Props = {
  title: string;
  showBackIcon?: boolean;
  showGreeting?: boolean;
};

const AppHeader: FC<Props> = ({ title, showBackIcon = false, showGreeting = false }) => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  return (
    <div
      className="bg-white border-b border-gray-100 px-4 pb-3 flex-shrink-0"
      style={{ paddingTop: 'calc(var(--zaui-safe-area-inset-top, 0px) + 14px)' }}
    >
      <div className="flex items-center gap-3">
        {showBackIcon && (
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors -ml-1 flex-shrink-0"
          >
            <Icon icon="zi-chevron-left" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          {showGreeting ? (
            <p className="text-lg font-bold text-gray-900 leading-tight truncate">
              {user ? `Xin chào, ${user.fullName} 👋` : 'Xin chào, bạn 👋'}
            </p>
          ) : (
            <p className="text-base font-semibold text-gray-900 truncate">{title}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;

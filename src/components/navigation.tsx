import { useVirtualKeyboardVisible } from "hooks";
import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router";
import { MenuItem } from "types/menu";
import { BottomNavigation, Icon } from "zmp-ui";
import { Bookmark, QrCode } from "lucide-react";

const tabs: Record<string, MenuItem> = {
  "/": {
    label: "Trang chủ",
    icon: <Icon icon="zi-home" />,
  },
  "/stores": {
    label: "Cửa hàng",
    icon: <Icon icon="zi-location" />,
  },
  "/rewards": {
    label: "Phần thưởng",
    icon: <Bookmark size={22} />,
  },
  "/qr-code": {
    label: "QR Code",
    icon: <QrCode size={22} />,
  },
  "/profile": {
    label: "Tài khoản",
    icon: <Icon icon="zi-user" />,
  },
};

export type TabKeys = keyof typeof tabs;

export const Navigation: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();

  if (keyboardVisible) {
    return <></>;
  }

  return (
    <BottomNavigation
      id="footer"
      activeKey={location.pathname}
      onChange={navigate}
      className="z-50"
    >
      {Object.keys(tabs).map((path: TabKeys) => (
        <BottomNavigation.Item
          key={path}
          label={tabs[path].label}
          icon={tabs[path].icon}
          activeIcon={tabs[path].activeIcon}
        />
      ))}
    </BottomNavigation>
  );
};

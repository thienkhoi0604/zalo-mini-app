import { useEffect, useState } from 'react';
import { KEYBOARD_HEIGHT_THRESHOLD } from '@/constants';

const originalScreenHeight = window.innerHeight;

export function useVirtualKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const detect = () => {
      setVisible(window.innerHeight + KEYBOARD_HEIGHT_THRESHOLD < originalScreenHeight);
    };
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  return visible;
}

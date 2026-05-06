import { useState, useCallback, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from '../utils/notifyUtils';

interface NotificationPermissionState {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<void>;
}

export function useNotificationPermission(): NotificationPermissionState {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );

  const supported = isNotificationSupported();

  const requestPermission = useCallback(async () => {
    if (!supported) return;
    if (permission === 'denied' || permission === 'granted') return;

    const result = await requestNotificationPermission();
    setPermission(result);
  }, [supported, permission]);

  // 同步权限状态变化
  useEffect(() => {
    if (!supported) return;
    setPermission(getNotificationPermission());
  }, [supported]);

  return { supported, permission, requestPermission };
}

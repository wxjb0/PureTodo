// 检查浏览器是否支持通知
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

// 获取当前通知权限状态
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// 请求通知权限
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  return await Notification.requestPermission();
}

// 发送通知
export function sendNotification(title: string, body: string, onClick?: () => void): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: '/favicon.ico',
    tag: 'todo-reminder'
  });

  if (onClick) {
    notification.onclick = () => {
      window.focus();
      onClick();
      notification.close();
    };
  }
}

import { format, formatISO, parseISO, isBefore, isAfter, differenceInMinutes, differenceInHours } from 'date-fns';

// 格式化日期为ISO字符串
export function toISODate(date: Date): string {
  return formatISO(date);
}

// 解析ISO字符串为Date对象
export function parseISODate(isoString: string): Date {
  return parseISO(isoString);
}

// 格式化日期显示
export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'yyyy-MM-dd HH:mm');
}

// 格式化为相对时间
export function formatRelativeDate(isoString: string): string {
  const date = parseISO(isoString);
  const now = new Date();
  const diffMins = differenceInMinutes(now, date);
  const diffHours = differenceInHours(now, date);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  return format(date, 'MM-dd HH:mm');
}

// 检查截止时间是否已过期
export function isDeadlineExpired(deadline: string): boolean {
  return isBefore(parseISO(deadline), new Date());
}

// 检查截止时间是否即将到期（1小时内）
export function isDeadlineSoon(deadline: string): boolean {
  const deadlineDate = parseISO(deadline);
  const now = new Date();
  const diffHours = differenceInHours(deadlineDate, now);
  return diffHours <= 1 && isAfter(deadlineDate, now);
}

// 计算提醒时间（截止时间减去提前提醒分钟数）
export function calculateRemindTime(deadline: string, advanceMinutes: number): Date {
  const deadlineDate = parseISO(deadline);
  return new Date(deadlineDate.getTime() - advanceMinutes * 60 * 1000);
}

// 格式化截止时间显示
export function formatDeadline(deadline: string): string {
  const deadlineDate = parseISO(deadline);
  const now = new Date();
  const diffHours = differenceInHours(deadlineDate, now);

  if (isBefore(deadlineDate, now)) return '已过期';
  if (diffHours < 1) return '即将到期';
  if (diffHours < 24) return `${diffHours}小时后到期`;
  return format(deadlineDate, 'MM-dd HH:mm');
}

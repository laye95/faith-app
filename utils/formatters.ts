export function formatFullDate(date: Date | string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export type FormatRelativeDateOptions = {
  yesterday?: string;
  daysAgo?: (n: number) => string;
  weeksAgo?: (n: number) => string;
};

const defaultRelativeOptions: Required<FormatRelativeDateOptions> = {
  yesterday: 'Yesterday',
  daysAgo: (n) => `${n}d ago`,
  weeksAgo: (n) => `${n}w ago`,
};

export function formatRelativeDate(
  date: Date | string | null,
  options?: FormatRelativeDateOptions,
): string {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000),
  );
  const opts = { ...defaultRelativeOptions, ...options };
  if (diffDays === 0) {
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (diffDays === 1) return opts.yesterday;
  if (diffDays < 7) return opts.daysAgo(diffDays);
  if (diffDays < 30) return opts.weeksAgo(Math.floor(diffDays / 7));
  return d.toLocaleDateString();
}

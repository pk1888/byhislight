export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Gentler phrasing for the altar card: "48 minutes", "2 hours", "16 days"
export function formatUptimeWords(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return 'a few moments';
  if (minutes < 60) return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? '1 hour' : `${hours} hours`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day' : `${days} days`;
}


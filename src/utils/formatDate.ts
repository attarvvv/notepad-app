export function formatNoteDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Time format (e.g. 10:45 AM)
  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (diffInDays === 0) {
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `Today, ${timeStr}`;
  } else if (diffInDays === 1) {
    return `Yesterday, ${timeStr}`;
  } else if (diffInDays < 7) {
    const dayName = date.toLocaleDateString([], { weekday: 'short' });
    return `${dayName}, ${timeStr}`;
  } else {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

export function formatDetailedDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

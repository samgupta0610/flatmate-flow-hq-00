// Timezone utilities for India Standard Time (IST)

export const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30

/**
 * Convert UTC time to IST
 */
export const utcToIST = (utcDate: Date): Date => {
  return new Date(utcDate.getTime() + IST_OFFSET);
};

/**
 * Convert IST time to UTC
 */
export const istToUTC = (istDate: Date): Date => {
  return new Date(istDate.getTime() - IST_OFFSET);
};

/**
 * Get current IST time
 */
export const getCurrentIST = (): Date => {
  return utcToIST(new Date());
};

/**
 * Format time in IST for display
 */
export const formatISTTime = (date: Date): string => {
  const istDate = utcToIST(date);
  return istDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Get current IST day name
 */
export const getCurrentISTDayName = (): string => {
  const istDate = getCurrentIST();
  return istDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    timeZone: 'Asia/Kolkata'
  }).toLowerCase();
};

/**
 * Format IST time for message display
 */
export const formatISTForMessage = (date: Date = new Date()): string => {
  const istDate = utcToIST(date);
  return istDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
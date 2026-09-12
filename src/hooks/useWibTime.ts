import { useState, useEffect } from 'react';

/**
 * Hook to provide real-time ticking clock formatted in WIB (Waktu Indonesia Barat / Asia/Jakarta)
 * Returns formatted string: "HH:mm:ss WIB"
 */
export const useWibTime = (): string => {
  const getFormattedWib = (): string => {
    try {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      return `${timeStr} WIB`;
    } catch {
      const now = new Date();
      return `${now.toTimeString().slice(0, 8)} WIB`;
    }
  };

  const [time, setTime] = useState<string>(getFormattedWib);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedWib());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
};

import { useEffect, useState } from "react";

/**
 * Formats a remaining-seconds count as either "M:SS" or "H:MM:SS".
 */
function formatDuration(totalSeconds) {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = Math.floor(clamped % 60);

  const pad = (n) => String(n).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}

/**
 * Tracks the remaining time until `expiresAt` (an ISO timestamp string
 * or Date), updating every second.
 *
 * @param {string | Date | null} expiresAt
 * @returns {{ secondsLeft: number, formatted: string, isExpired: boolean }}
 */
export function useCountdown(expiresAt) {
  const [secondsLeft, setSecondsLeft] = useState(() => computeSecondsLeft(expiresAt));

  useEffect(() => {
    setSecondsLeft(computeSecondsLeft(expiresAt));

    if (!expiresAt) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft(computeSecondsLeft(expiresAt));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  return {
    secondsLeft,
    formatted: formatDuration(secondsLeft),
    isExpired: secondsLeft <= 0
  };
}

function computeSecondsLeft(expiresAt) {
  if (!expiresAt) return 0;
  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.round((expiryTime - now) / 1000));
}

import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';

export function useIsGameLive(): boolean {
  const curretnDate = new Date();
  const goLiveDate = process.env.NEXT_PUBLIC_GAME_GO_LIVE_DATE as string;
  const goDownDate = process.env.NEXT_PUBLIC_GAME_GO_DOWN_DATE as string;

  if (!goLiveDate || !goDownDate) return false;

  return (
    isAfter(curretnDate, new Date(goLiveDate)) &&
    isBefore(curretnDate, new Date(goDownDate))
  );
}

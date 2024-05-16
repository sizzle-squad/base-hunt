import { SpinData, SpinOption, SpinOptionTypeEnum } from '@/hooks/types';

export type UserSpinType = {
  id: number;
  created_at: string;
  game_id: number;
  user_address: string;
  last_spin_at: string;
  last_spin_id: number;
  total_spins: number;
};

export function currentTimeUTC(): string {
  return new Date().toISOString();
}

function getTodayResetTime(): Date {
  const now = new Date();
  // Reset time to 23:59:59 UTC of the previous day
  const todayResetTime = new Date(now);
  todayResetTime.setUTCHours(23, 59, 59, 999);
  todayResetTime.setUTCDate(todayResetTime.getUTCDate() - 1);
  return todayResetTime;
}

export function hasAvailableSpin(lastSpinAt: string): boolean {
  const todayResetTime = getTodayResetTime();

  // Convert last_spin_at to a timestamp
  const lastSpinTime = new Date(lastSpinAt).getTime();

  // If lastSpinTime is before today's reset time, the user has a spin available
  return lastSpinTime <= todayResetTime.getTime();
}

export function calculateTimeUntilMidnightUTC(): number {
  const now = new Date();
  // Set to midnight UTC of the next day
  const nextMidnightUTC = new Date(now);
  nextMidnightUTC.setUTCHours(24, 0, 0, 0);

  return nextMidnightUTC.getTime() - now.getTime();
}

export function getRandomOutcome(spinOptions: SpinOption[]): SpinOption {
  const totalprobability = spinOptions.reduce(
    (total, outcome) => total + outcome.probability,
    0
  );
  let randomprobability = Math.random() * totalprobability;

  for (const outcome of spinOptions) {
    randomprobability -= outcome.probability;
    if (randomprobability <= 0) {
      return outcome;
    }
  }

  // This should never happen if the spinOptions array is not empty
  throw new Error('No outcome selected');
}

export function getAllSpins(spinOptions: any): SpinOption[] {
  if (!spinOptions) return [];
  return spinOptions.map((spinOption: any) => ({
    id: spinOption.id,
    points: spinOption.points,
    probability: spinOption.probability,
    type: spinOption.type,
  }));
}

export function getEnabledSpins(spinOptions: any): SpinOption[] {
  if (!spinOptions) return [];
  return spinOptions.map((spinOption: any) => {
    if (spinOption.enabled) {
      return {
        id: spinOption.id,
        points: spinOption.points,
        probability: spinOption.probability,
        type: spinOption.type,
      };
    }
    return;
  });
}

export function getUserSpinData(
  spinData: any,
  spinOptions: SpinOption[]
): SpinData {
  if (!spinData) {
    return {
      id: '',
      gameId: '',
      userAddress: '',
      hasAvailableSpin: true,
      lastSpinResult: null,
      totalSpins: 0,
    };
  }

  return {
    id: spinData.id,
    gameId: spinData.game_id,
    userAddress: spinData.user_address,
    hasAvailableSpin: hasAvailableSpin(spinData.last_spin_at),
    lastSpinResult:
      spinOptions.find((option) => option.id == spinData.last_spin) ?? null,
    totalSpins: spinData.total_spins,
  };
}

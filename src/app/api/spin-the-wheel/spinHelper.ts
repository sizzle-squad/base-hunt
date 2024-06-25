import { SupabaseClient } from '@supabase/supabase-js';
import { SpinData, SpinOption, SpinOptionTypeEnum } from '@/hooks/types';

export type UserSpinType = {
  id: number;
  created_at: string;
  game_id: number;
  user_address: string;
  last_spin_id: number;
};

const resetHourUtc = 16; // Reset time for STW is 9 AM PST = 4PM UTC

export function currentTimeUTC(): string {
  return new Date().toISOString();
}

function getTodayResetTime(): Date {
  const now = new Date();
  const todayResetTime = new Date(now);
  todayResetTime.setUTCHours(resetHourUtc, 0, 0, 0);
  // If the current time is before the reset time, set the reset time to the previous day
  if (now < todayResetTime) {
    todayResetTime.setDate(todayResetTime.getDate() - 1);
  }
  return todayResetTime;
}

export function hasAvailableSpin(lastSpinAt: string): boolean {
  const todayResetTime = getTodayResetTime();

  // Convert lastSpinAt to a timestamp
  const lastSpinTime = new Date(lastSpinAt).getTime();

  // If lastSpinTime is before today's reset time, the user has a spin available
  return lastSpinTime <= todayResetTime.getTime();
}

export function calculateTimeUntilResetTime(): number {
  const now = new Date();

  const nextResetUtc = new Date(now);
  nextResetUtc.setUTCHours(resetHourUtc, 0, 0, 0);

  return nextResetUtc.getTime() - now.getTime();
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
  return spinOptions
    .filter((spinOption: any) => spinOption.enabled)
    .map((spinOption: any) => {
      return {
        id: spinOption.id,
        points: spinOption.points,
        probability: spinOption.probability,
        type: spinOption.type,
      };
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
    };
  }

  return {
    id: spinData.id,
    gameId: spinData.game_id,
    userAddress: spinData.user_address,
    hasAvailableSpin: hasAvailableSpin(spinData.created_at),
    lastSpinResult:
      spinOptions.find((option) => option.id == spinData.spin_result) ?? null,
  } as SpinData;
}

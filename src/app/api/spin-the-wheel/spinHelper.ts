import { SupabaseClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { AirdropUSDCValue, SpinData, SpinOption } from '@/hooks/types';
import { airdropNft } from '@/utils/walletapi';

export type UserSpinType = {
  id: number;
  created_at: string;
  game_id: number;
  user_address: string;
  last_spin_id: number;
};

const resetHourUtc = 7; // Reset time for midnight PST is 7 AM UTC

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
  const lastSpinTime = new Date(convertPSTtoUTC(lastSpinAt)).getTime();

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

export async function airdropUSDC(
  userAddress: string,
  airdropCmd: AirdropUSDCValue
): Promise<boolean> {
  const random_nonce = ethers.hexlify(ethers.randomBytes(32));
  try {
    await airdropNft(userAddress, airdropCmd, random_nonce);
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}

function convertPSTtoUTC(pstTimeStr: string): string {
  let pstTime = new Date(pstTimeStr);

  // Convert the PST time to UTC
  let utcTime = new Date(pstTime.getTime() + resetHourUtc * 60 * 60 * 1000);

  return utcTime.toISOString();
}

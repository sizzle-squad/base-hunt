import { SpinData, SpinOption, SpinOptionTypeEnum } from '@/hooks/types';
import {
  calculateTimeUntilResetTime,
  getAllSpins,
  getEnabledSpins,
  getRandomOutcome,
  getUserSpinData,
  hasAvailableSpin,
} from './spinHelper';

const mockSpinOptions = [
  {
    id: 1,
    type: 'POINTS',
    points: 10,
    enabled: true,
    game_id: 2,
    created_at: '2024-05-15T20:15:10.972555+00:00',
    probability: 50,
  },
  {
    id: 2,
    type: 'POINTS',
    points: 50,
    enabled: false,
    game_id: 2,
    created_at: '2024-05-15T20:15:27.893739+00:00',
    probability: 25,
  },
  {
    id: 3,
    type: 'POINTS',
    points: 75,
    enabled: true,
    game_id: 2,
    created_at: '2024-05-15T20:15:42.580279+00:00',
    probability: 10,
  },
];

const mockUserSpinData = {
  id: 34,
  game_id: 2,
  last_spin: 2,
  created_at: '2024-05-17T18:05:51.071315+00:00',
  total_spins: 1,
  last_spin_at: '2024-05-17T18:05:50.817+00:00',
  user_address: '0xf4491fffa96382d48949cb4fffa39a3d6eb9b11a',
};

describe('get spins', () => {
  it('should return correct count for getAllSpins', () => {
    const spinsOutput = getAllSpins(mockSpinOptions);

    expect(spinsOutput.length).toBe(3);
  });
  it('should return correct count for getEnabledSpins', () => {
    const spinsOutput = getEnabledSpins(mockSpinOptions);
    expect(spinsOutput.length).toBe(2);
  });
});

describe('getUserSpinData', () => {
  it('should return correct data when user has spin data', () => {
    const allSpins = getAllSpins(mockSpinOptions);
    const userSpinDataOutput = getUserSpinData(mockUserSpinData, allSpins);

    expect(userSpinDataOutput).toStrictEqual({
      id: 34,
      gameId: 2,
      userAddress: '0xf4491fffa96382d48949cb4fffa39a3d6eb9b11a',
      hasAvailableSpin: true,
      lastSpinResult: {
        id: 2,
        points: 50,
        probability: 25,
        type: SpinOptionTypeEnum.POINTS,
      },
      totalSpins: 1,
    });
  });

  it('should return empty when user has no spin data', () => {
    const allSpins = getAllSpins(mockSpinOptions);
    const userSpinDataOutput = getUserSpinData(undefined, allSpins);

    expect(userSpinDataOutput).toStrictEqual({
      id: '',
      gameId: '',
      userAddress: '',
      hasAvailableSpin: true,
      lastSpinResult: null,
      totalSpins: 0,
    });
  });
});

describe('getRandomOutcome', () => {
  it('should return random spin output', () => {
    const enabledSpins = getEnabledSpins(mockSpinOptions);
    const spinOutput = getRandomOutcome(enabledSpins);

    expect(spinOutput).toBeDefined();
    expect(spinOutput.id).toBeDefined();
    expect(spinOutput.points).toBeDefined();
  });

  it('should throw error due to empty array', () => {
    expect(() => getRandomOutcome([])).toThrow();
  });
});

describe('calculateTimeUntilResetTime', () => {
  it('should calculate the correct time until reset', () => {
    // Mock the Date so new Date(); returns a fixed date in the function
    const mockDate = new Date(Date.UTC(2024, 4, 20, 14, 0, 0));
    const originalDate = Date;
    global.Date = class extends Date {
      constructor(date?: any) {
        super();
        if (date) {
          return new originalDate(date);
        }
        return mockDate;
      }
    } as any;

    const twoHoursInMs = 7200000;
    const result = calculateTimeUntilResetTime();
    expect(result).toBe(twoHoursInMs);

    // Clean up the mock to ensure it doesn't affect other tests
    global.Date = originalDate;
  });
});

describe('hasAvailableSpin', () => {
  it('should return false if last spin was 4am and current time is 7am PST', () => {
    // Mock the Date so new Date(); returns a fixed date in the function
    const mockDate = new Date(Date.UTC(2024, 4, 20, 14, 0, 0));
    const originalDate = Date;
    global.Date = class extends Date {
      constructor(date?: any) {
        super();
        if (date) {
          return new originalDate(date);
        }
        return mockDate;
      }
    } as any;

    const lastSpinAt = new Date(Date.UTC(2024, 4, 20, 11, 0, 0)).toISOString();
    const result = hasAvailableSpin(lastSpinAt);
    expect(result).toBe(false);

    // Clean up the mock to ensure it doesn't affect other tests
    global.Date = originalDate;
  });

  it('should return true if last spin was 8:30am and current time is 1pm PST', () => {
    // Mock the Date so new Date(); returns a fixed date in the function
    const mockDate = new Date(Date.UTC(2024, 4, 20, 20, 0, 0));
    const originalDate = Date;
    global.Date = class extends Date {
      constructor(date?: any) {
        super();
        if (date) {
          return new originalDate(date);
        }
        return mockDate;
      }
    } as any;

    const lastSpinAt = new Date(Date.UTC(2024, 4, 20, 15, 30, 0)).toISOString();
    const result = hasAvailableSpin(lastSpinAt);
    expect(result).toBe(true);

    // Clean up the mock to ensure it doesn't affect other tests
    global.Date = originalDate;
  });

  it('should return false if last spin was 10am and current time is 2am next day PST', () => {
    // Mock the Date so new Date(); returns a fixed date in the function
    const mockDate = new Date(Date.UTC(2024, 4, 21, 1, 0, 0));
    const originalDate = Date;
    global.Date = class extends Date {
      constructor(date?: any) {
        super();
        if (date) {
          return new originalDate(date);
        }
        return mockDate;
      }
    } as any;

    const lastSpinAt = new Date(Date.UTC(2024, 4, 20, 17, 0, 0)).toISOString();
    const result = hasAvailableSpin(lastSpinAt);
    expect(result).toBe(false);

    // Clean up the mock to ensure it doesn't affect other tests
    global.Date = originalDate;
  });

  it('should return true if last spin was days before current time', () => {
    // Mock the Date so new Date(); returns a fixed date in the function
    const mockDate = new Date(Date.UTC(2024, 4, 21, 1, 0, 0));
    const originalDate = Date;
    global.Date = class extends Date {
      constructor(date?: any) {
        super();
        if (date) {
          return new originalDate(date);
        }
        return mockDate;
      }
    } as any;

    const lastSpinAt = new Date(Date.UTC(2024, 4, 5, 17, 0, 0)).toISOString();
    const result = hasAvailableSpin(lastSpinAt);
    expect(result).toBe(true);

    // Clean up the mock to ensure it doesn't affect other tests
    global.Date = originalDate;
  });
});

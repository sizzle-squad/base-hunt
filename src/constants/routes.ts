export const routes = {
  cbProfile: '/api/cb-profile',
  profile: {
    score: '/api/profile/score',
    state: '/api/profile/state',
    guild: '/api/profile/guild',
    levels: '/api/profile/level',
    optIn: '/api/profile/opt-in',
  },
  treasureBox: {
    rank: '/api/treasure-box/rank',
    topRanks: '/api/treasure-box/top-ranks',
    state: '/api/treasure-box/state',
    default: '/api/treasure-box',
  },
  challenges: {
    default: '/api/challenges',
    complete: '/api/challenges/complete',
  },
  guild: {
    default: '/api/guild',
    state: '/api/guild/state',
    claim: 'api/guild/claim',
  },
};

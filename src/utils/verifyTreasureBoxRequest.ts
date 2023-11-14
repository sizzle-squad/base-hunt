import { TreasureBoxType } from '@/app/api/treasure-box/route';

export function verifyTreasureBoxRequest(body: TreasureBoxType) {
  const { gameId, user } = body;

  // check if it has all the required fields
  if (!gameId) {
    return new Response('Missing parameters: gameId', { status: 400 });
  }

  if (!user) {
    return new Response('Missing parameters: user', { status: 400 });
  }

  if (!user.address) {
    return new Response('Missing parameters: user address', { status: 400 });
  }
}

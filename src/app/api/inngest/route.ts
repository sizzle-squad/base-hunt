import { serve } from 'inngest/next';

import { inngest } from '@/utils/inngest/client';
import {
  guildTxCount,
  userPointDistribute,
  userTxCount,
} from '@/utils/inngest/functions';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userTxCount, userPointDistribute, guildTxCount],
});

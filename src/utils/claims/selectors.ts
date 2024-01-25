import { ChallengeType, CheckFunctionType } from '../database.enums';
import { WebhookData } from '../webhook';
import { checkBalance, checkTokenIdBalance } from './balanceCheck';
import { checkMint } from './mintCheck';
import { checkFunctionExecution } from './transactionCheck';
import { checkTrivia } from './triviaCheck';
import { checkTxCountBatch } from './txHistoryCheck';
import { Database } from '../database.types';

export const CheckFunctions: {
  [key in CheckFunctionType]: (...args: any[]) => Promise<boolean>;
} = {
  [CheckFunctionType.checkMint]: checkMint,
  [CheckFunctionType.checkTrivia]: checkTrivia,
  [CheckFunctionType.checkFunctionExecution]: checkFunctionExecution,
  [CheckFunctionType.checkBalance]: checkBalance,
  [CheckFunctionType.checkTokenIdBalance]: checkTokenIdBalance,
  [CheckFunctionType.getTxCountBatch]: checkTxCountBatch,
};

export const MapChallengeTypeUserAddress: {
  [key in CheckFunctionType]: (w: WebhookData) => string | undefined;
} = {
  [CheckFunctionType.checkMint]: (w: WebhookData) => w.to_address,
  [CheckFunctionType.checkFunctionExecution]: (w: WebhookData) =>
    w.from_address,
  [CheckFunctionType.checkTokenIdBalance]: function (
    w: WebhookData
  ): string | undefined {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.getTxCountBatch]: function (
    w: WebhookData
  ): string | undefined {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkTrivia]: function (
    w: WebhookData
  ): string | undefined {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkBalance]: function (
    w: WebhookData
  ): string | undefined {
    throw new Error('Function not implemented.');
  },
};

export const ScoreFunctions: {
  [key in CheckFunctionType]: (...args: any[]) => number;
} = {
  [CheckFunctionType.checkMint]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkTrivia]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkFunctionExecution]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkBalance]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkTokenIdBalance]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.getTxCountBatch]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
};

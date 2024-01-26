import { ChallengeType, CheckFunctionType } from '../database.enums';
import { WebhookData } from '../webhook';
import {
  CheckBalanceParams,
  checkBalance,
  checkTokenIdBalance,
} from './balanceCheck';
import { checkMint } from './mintCheck';
import { checkFunctionExecution } from './transactionCheck';
import { checkTrivia } from './triviaCheck';
import { CheckTxCountBatchParams, checkTxCountBatch } from './txHistoryCheck';
import { Database } from '../database.types';

export const CheckFunctions: {
  [key in CheckFunctionType]: (...args: any[]) => Promise<boolean>;
} = {
  [CheckFunctionType.checkMint]: checkMint,
  [CheckFunctionType.checkTrivia]: checkTrivia,
  [CheckFunctionType.checkFunctionExecution]: checkFunctionExecution,
  [CheckFunctionType.checkBalance]: checkBalance,
  [CheckFunctionType.checkTokenIdBalance]: checkTokenIdBalance,
  [CheckFunctionType.checkTxCountBatch]: checkTxCountBatch,
};

export const MapChallengeTypeUserAddress: {
  [key in CheckFunctionType]: (w: any) => string | undefined;
} = {
  [CheckFunctionType.checkMint]: (w: WebhookData) => w.to_address,
  [CheckFunctionType.checkFunctionExecution]: (w: WebhookData) =>
    w.from_address.toLowerCase(),
  [CheckFunctionType.checkTokenIdBalance]: function (
    body: CheckBalanceParams
  ): string {
    return body.userAddress.toLowerCase();
  },
  [CheckFunctionType.checkTxCountBatch]: function (
    body: CheckTxCountBatchParams
  ): string | undefined {
    return body.userAddress.toLowerCase();
  },
  [CheckFunctionType.checkTrivia]: function (o: any): string {
    return o.userAddress.toLowerCase();
  },
  [CheckFunctionType.checkBalance]: function (
    body: CheckBalanceParams
  ): string {
    return body.userAddress.toLowerCase();
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
  [CheckFunctionType.checkTxCountBatch]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
};

export const ValidateBodyParams: {
  [key in CheckFunctionType]: (body: object) => boolean;
} = {
  [CheckFunctionType.checkMint]: function (body: object): boolean {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkTrivia]: function (body: object): boolean {
    return body && body.hasOwnProperty('submitted');
  },
  [CheckFunctionType.checkFunctionExecution]: function (body: object): boolean {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkBalance]: function (body: object): boolean {
    return true;
  },
  [CheckFunctionType.checkTokenIdBalance]: function (body: object): boolean {
    return true;
  },
  [CheckFunctionType.checkTxCountBatch]: function (body: object): boolean {
    return body && body.hasOwnProperty('userAddress');
  },
};

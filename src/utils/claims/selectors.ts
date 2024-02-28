import { ethers, JsonRpcProvider } from 'ethers';
import {
  checkBalance,
  CheckBalanceParams,
  checkTokenIdBalance,
} from './balanceCheck';
import { checkMint } from './mintCheck';
import {
  CheckExectionParams,
  checkFunctionExecution,
} from './transactionCheck';
import { checkTrivia, CheckTriviaParams } from './triviaCheck';
import { checkTxCountBatch, CheckTxCountBatchParams } from './txHistoryCheck';
import { CheckFunctionType } from '../database.enums';
import { WebhookData } from '../webhook';

export const CheckFunctions: {
  [key in CheckFunctionType]: (...args: any[]) => Promise<boolean>;
} = {
  [CheckFunctionType.checkMint]: checkMint,
  [CheckFunctionType.checkTrivia]: checkTrivia,
  [CheckFunctionType.checkFunctionExecution]: checkFunctionExecution,
  [CheckFunctionType.checkBalance]: checkBalance,
  [CheckFunctionType.checkTokenIdBalance]: checkTokenIdBalance,
  [CheckFunctionType.checkTxCountBatch]: checkTxCountBatch,
  [CheckFunctionType.checkJoinGuild]: function (body: any): Promise<boolean> {
    throw new Error('Function not implemented.');
  },
};

export const MapChallengeTypeUserAddress: {
  [key in CheckFunctionType]: (w: any) => Promise<string | undefined>;
} = {
  [CheckFunctionType.checkMint]: async (w: WebhookData) =>
    w.to_address.toLowerCase(),
  [CheckFunctionType.checkFunctionExecution]: async (
    w: CheckExectionParams & { provider: any }
  ) => {
    try {
      if (DecodeDataFunction.hasOwnProperty(w.contract_address.toLowerCase())) {
        return await DecodeDataFunction[w.contract_address.toLowerCase()](w);
      } else {
        return w.from_address.toLowerCase();
      }
    } catch (e) {
      console.error(`error decoding user address from input args:`, e);
      return;
    }
  },
  [CheckFunctionType.checkTokenIdBalance]: async function (
    body: CheckBalanceParams
  ): Promise<string> {
    return body.userAddress.toLowerCase();
  },
  [CheckFunctionType.checkTxCountBatch]: async function (
    body: CheckTxCountBatchParams
  ): Promise<string | undefined> {
    return body.userAddress.toLowerCase();
  },
  [CheckFunctionType.checkTrivia]: async function (
    body: CheckTriviaParams
  ): Promise<string> {
    return body.userAddress.toLowerCase();
  },
  [CheckFunctionType.checkBalance]: async function (
    body: CheckBalanceParams
  ): Promise<string> {
    return body.userAddress.toLowerCase();
  },
  [CheckFunctionType.checkJoinGuild]: async function (
    body: any
  ): Promise<string> {
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
  [CheckFunctionType.checkTxCountBatch]: function (w: any): number {
    throw new Error('Function not implemented.');
  },
  [CheckFunctionType.checkJoinGuild]: function (w: any): number {
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
  [CheckFunctionType.checkJoinGuild]: function (body: object): boolean {
    throw new Error('Function not implemented.');
  },
};

//Contract specific decoders
export const DecodeDataFunction: {
  [id: string]: (tx: any) => Promise<string | undefined>;
} = {
  '0xad27383460183fd7e21b71df3b4cac9480eb9a75': async function (
    w: CheckExectionParams & { provider: JsonRpcProvider }
  ): Promise<string | undefined> {
    const tx = await w.provider.getTransaction(w.transaction_hash);
    const iface = new ethers.Interface(['function ' + w.function]);
    if (!tx) {
      console.warn('tx-hash not found:', w.transaction_hash);
      return;
    }
    const decoded = iface.decodeFunctionData(w.function.split('(')[0], tx.data);
    console.log('decoded:', decoded);
    const receiveWithAuthorization_ = decoded[3];

    const results = ethers.AbiCoder.defaultAbiCoder().decode(
      ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes32'],
      receiveWithAuthorization_
    );
    return results[0].toLowerCase();
  },
};

import { CheckFunctionType } from '../database.enums';
import { checkBalance, checkTokenIdBalance } from './balanceCheck';
import { checkMint } from './mintCheck';
import { checkFunctionExecution } from './transactionCheck';
import { checkTrivia } from './triviaCheck';
import { checkTxCountBatch } from './txHistoryCheck';

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

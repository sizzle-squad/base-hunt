import { ethers } from 'ethers';

export interface CheckBalanceParams {
  answer: string;
}

export async function checkTrivia(
  answer: string,
  params: CheckBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  return answer.toLocaleLowerCase() === params.answer.toLocaleLowerCase();
}

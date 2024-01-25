import { ethers } from 'ethers';

export type CheckTriviaConfiguration = {
  params: {
    answer: string;
  };
};
export type CheckTriviaParams = {
  submitted: string;
} & CheckTriviaConfiguration;

export async function checkTrivia(
  params: CheckTriviaParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  return params.params.answer.toLowerCase() === params.submitted.toLowerCase();
}

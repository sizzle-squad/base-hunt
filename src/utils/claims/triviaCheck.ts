import { ethers } from 'ethers';

export type CheckTriviaParams = {
  submitted: string;
  answer: string;
};

export async function checkTrivia(
  params: CheckTriviaParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  return (
    params.answer.toLocaleLowerCase() === params.submitted.toLocaleLowerCase()
  );
}

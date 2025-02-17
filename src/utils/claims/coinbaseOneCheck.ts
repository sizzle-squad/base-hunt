import { ethers } from 'ethers';
import { CheckBalanceConfiguration } from './balanceCheck';
const COINBASE_ONE_EAS_ATTESTER_ADDRESS =
  '0x357458739F90461b99789350868CD7CF330Dd7EE';
const COINBASE_ONE_EAS_SCHEMA_ID =
  '0x254bd1b63e0591fefa66818ca054c78627306f253f86be6023725a67ee6bf9f4';
const EAS_BASE_EASSCAN_GRAPHQL_URL = 'https://base.easscan.org/graphql';
type Params = {
  recipientAddress: `0x${string}`;
};

export type CheckCoinbaseOne = {
  userAddress: string;
} & CheckBalanceConfiguration;

type AttestationsResponse = {
  data: {
    attestations: {
      id: string;
      revoked: boolean;
      recipient: string;
      data: string;
    }[];
  };
};

export async function generateGetAttestations({ recipientAddress }: Params) {
  const body = {
    query:
      'query Attestations($where: AttestationWhereInput) { attestations(where: $where) { id revoked recipient data }}',
    variables: {
      where: {
        attester: {
          equals: COINBASE_ONE_EAS_ATTESTER_ADDRESS,
        },
        recipient: {
          equals: recipientAddress,
        },
        schemaId: {
          equals: COINBASE_ONE_EAS_SCHEMA_ID,
        },
        revoked: {
          equals: false,
        },
      },
    },
  };

  try {
    const response = await fetch(EAS_BASE_EASSCAN_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error('Base easscan fetch failed:', response.status);
      return null;
    }

    const result: AttestationsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Base easscan fetch failed:', error);
    return null;
  }
}

export async function checkCoinbaseOne(
  params: CheckCoinbaseOne,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const userAddress: `0x${string}` = params.userAddress as `0x${string}`;
  const result = await generateGetAttestations({
    recipientAddress: userAddress,
  });
  if (!result) {
    return false;
  }
  const attestations = result.attestations;
  // if user has one attestation that is not revoked, they have coinbase one
  return attestations.some((attestation) => attestation.revoked === false);
}

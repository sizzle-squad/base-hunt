const FEATURES: Record<string, boolean> = {
  referrals: process.env.NEXT_PUBLIC_REFFERALS_IN_BETA === 'true',
};

type Props = {
  address: `0x${string}` | undefined;
  feature: string | undefined;
};

export function useIsBetaTestersByFeature({ address, feature }: Props) {
  if (!address || !feature) return false;

  const betaTesters: string[] = (
    process.env.NEXT_PUBLIC_BETA_TESTERS ?? ''
  ).split(',');

  // beta testers get access OR feature flag is off from a feature
  return (
    betaTesters.some((beta) => beta.toLowerCase() === address.toLowerCase()) ||
    !FEATURES[feature]
  );
}

export function useIsBetaTesters({ address }: Omit<Props, 'feature'>) {
  if (!address) return false;

  const betaTesters: string[] = (
    process.env.NEXT_PUBLIC_BETA_TESTERS ?? ''
  ).split(',');

  // beta testers get access OR feature flag is off from a feature
  return betaTesters.some(
    (beta) => beta.toLowerCase() === address.toLowerCase()
  );
}

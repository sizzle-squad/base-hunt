'use client';
import { Stack } from '@mui/material';
import Text from '@/components/Text';
import { useMetrics } from '@/hooks/useMetrics';
import { GAME_ID } from '@/constants/gameId';

export default function Metrics() {

  const { data: metrics, isLoading } = useMetrics({ gameId: GAME_ID });

  const MinterData = ({ minter, data }) => (
    <div>
        <Text useMonoFont fontSize="25px" color="white">Minter: {minter}</Text>
        <Stack flexDirection="column" mt={3}>
        {data.ownedNfts && data.ownedNfts.map((data) => {
            if (data.contract) {
                const contract = data.contract
                return (
                    <Stack flexDirection="column" mb={3}>
                        <Text useMonoFont fontSize="18px" color="white">Contract: {contract.address}</Text>
                        <Text useMonoFont fontSize="18px" color="white">Name: {data.name}</Text>
                        <Text useMonoFont fontSize="18px" color="white">Balance: {data.balance}</Text>
                    </Stack>
                )
            }
        })}
      </Stack>
    </div>
  );
  
  return (
    <Stack
      width="100%"
      margin="auto"
      alignItems="center"
      p="20px"
      gap="20px"
      bgcolor="black"
      height="100vh"
      justifyContent="left"
    >
        <Stack
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="left"
        >
            {metrics && Object.entries(metrics)
                .filter(([minter, data]) => data.ownedNfts && data.ownedNfts.length > 0)
                .map(([minter, data]) => (
                    <MinterData key={minter} minter={minter} data={data} />
            ))}
      </Stack>
    </Stack>
  );
}

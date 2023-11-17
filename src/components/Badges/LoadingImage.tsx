import { Skeleton } from '@mui/material';

function LoadingImage() {
  return (
    <Skeleton
      sx={{
        width: '256px',
        height: '256px',
        borderRadius: '12px',
      }}
      variant="rectangular"
    />
  );
}

export default LoadingImage;

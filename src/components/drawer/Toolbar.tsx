import {} from 'react';
import { Stack, IconButton } from '@mui/material';
import Text from '@/components/Text';

type ToolBarProps = {
  title: string;
  onDismiss?: () => void;
};

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" rx="12" fill="black" fillOpacity="0.2" />
    <path d="M16 8L8 16M8 8L16 16" stroke="white" strokeWidth="2" />
  </svg>
);

const ToolBar: React.FC<ToolBarProps> = ({ title, onDismiss }) => {
  return (
    <Stack
      flexDirection="row"
      position="relative"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack flexDirection="row" justifyContent="space-between" width="100%">
        <Text fontSize="20px">{title}</Text>
      </Stack>
      <IconButton onClick={onDismiss}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};

export default ToolBar;

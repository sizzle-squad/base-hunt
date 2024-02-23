import { Dialog, styled } from '@mui/material';

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    borderRadius: '20px',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

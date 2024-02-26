import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useCallback } from 'react';
import { BootstrapDialog } from '@/components/BoostrapDialog';
import Text from '@/components/Text';
import { useGameInfoContext } from '@/context/GameInfoContext';
import { Button } from '@/components/assets/Button';

export function GuildModal() {
  const { showModal, setShowModal } = useGameInfoContext();

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <BootstrapDialog
      onClose={closeModal}
      aria-labelledby="customized-dialog-title"
      open={showModal}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        How guilds work
      </DialogTitle>
      <DialogContent>
        <Text gutterBottom lineHeight="160%">
          • If your guild has the most points at the end of each day (5 PM MST),
          you’ll earn an <b>extra 100 points</b> for that day.
        </Text>
        <Text gutterBottom lineHeight="160%">
          • 1 point = 1 transaction on Base. Guild points are updated hourly.
        </Text>
        <Text gutterBottom lineHeight="160%">
          • The guild that wins the most days (out of 7) wins Base Hunt. In the
          event of a tie, we’ll look at total points to break the tie.
        </Text>
        <Text gutterBottom lineHeight="160%">
          • Once you’re in a guild, you cannot switch guilds. Choose wisely!
        </Text>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>
          <Text>Got it!</Text>
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

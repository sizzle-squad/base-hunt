import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Text from '@/components/Text';
import { useGameInfoContext } from '@/context/GameInfoContext';
import Pill from './Pill';

type Props = {
  onClick: () => void;
  value: string;
};

export function ModalPill({ onClick, value }: Props) {
  const { showModal } = useGameInfoContext();

  return (
    <Pill backgroundColor="none" onClick={onClick} hover>
      <Text>How guilds work</Text>
      {showModal ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </Pill>
  );
}

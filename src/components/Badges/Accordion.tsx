import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionPill from './AccordionPill';

export type Panel = 'irl' | 'virtual';

export default function CustomAccordion({
  children,
  title,
  toggleFunction,
  expanded,
  panel,
}: {
  title: string;
  children?: React.ReactNode;
  toggleFunction: (type: Panel) => void;
  expanded: boolean;
  panel: 'irl' | 'virtual';
}) {
  return (
    <div>
      <Accordion
        expanded={expanded}
        onChange={() => toggleFunction(panel)}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{
            paddingX: 0,
          }}
        >
          <Stack flexDirection="row" alignItems="center" gap={2}>
            <Typography
              variant="h5"
              textAlign="left"
              fontWeight="400"
              sx={{ fontSize: '22px' }}
            >
              {title}
            </Typography>
            <AccordionPill />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{children}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

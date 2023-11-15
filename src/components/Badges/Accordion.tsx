import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionPill from './AccordionPill';

export default function CustomAccordion({
  children,
  title,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  // State for the expanded accordion panel
  const [expanded, setExpanded] = useState<string | false>(false);

  // Handle changing the expanded accordion panel
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
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

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode } from 'react';
import { BadgeTypeEnum } from '@/hooks/types';

type Props = {
  title: string;
  children?: ReactNode;
  toggleFunction: (type: BadgeTypeEnum) => void;
  expanded: boolean;
  panel: BadgeTypeEnum;
  pill?: ReactNode;
};

export default function CustomAccordion({
  children,
  title,
  toggleFunction,
  expanded,
  panel,
  pill,
}: Props) {
  return (
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
          {pill}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
}

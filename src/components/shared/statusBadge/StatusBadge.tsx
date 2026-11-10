import type React from "react";
import styled from "styled-components";
import { FlightStatus } from "../../../types/flightTypes";
import { TicketStatus } from "../../../types/ticketTypes";
import { theme } from "../../../theme/theme";

interface Props {
  status: FlightStatus | TicketStatus;
}

const Badge = styled.div<{ $background: string; $text: string }>`
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 ${theme.spacing[10]};
  border-radius: ${theme.borderRadius.pill};
  gap: ${theme.spacing[6]};
  background-color: ${({ $background }) => $background};
  color: ${({ $text }) => $text};
`;

const Status = styled.div`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
`;

const Dot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${theme.borderRadius.round};
  background-color: ${({ $color }) => $color};
`;

const STATUS_BADGE_COLORS: Record<
  FlightStatus | TicketStatus,
  { background: string; text: string }
> = {
  [FlightStatus.SCHEDULED]: theme.colors.status.info,
  [FlightStatus.DELAYED]: theme.colors.status.warning,
  [FlightStatus.CANCELLED]: theme.colors.status.error,
  [FlightStatus.LANDED]: theme.colors.status.success,
  [TicketStatus.CONFIRMED]: theme.colors.status.success,
};

export const StatusBadge: React.FunctionComponent<Props> = ({ status }) => {
  const { background, text } = STATUS_BADGE_COLORS[status];

  return (
    <Badge $background={background} $text={text}>
      <Dot $color={text} />
      <Status>{status}</Status>
    </Badge>
  );
};

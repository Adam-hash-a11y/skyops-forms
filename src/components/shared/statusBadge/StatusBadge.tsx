import type React from "react";
import styled from "styled-components";

interface Props {
  status: string;
}

const Badge = styled.div<{ $background: string; $text: string }>`
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  gap: 6px;
  background-color: ${({ $background }) => $background};
  color: ${({ $text }) => $text};
`;

const Status = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

const Dot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

const STATUS_BADGE_COLORS: Record<
  string,
  { background: string; text: string }
> = {
  Scheduled: { background: "#E7F0FD", text: "#144AA0" },
  Delayed: { background: "#FFF1D6", text: "#8A4B00" },
  Cancelled: { background: "#FDE8E8", text: "#A4202A" },
  Landed: { background: "#E3F4EA", text: "#17653D" },
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

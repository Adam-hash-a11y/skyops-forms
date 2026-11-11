import styled from "styled-components";
import type { FunctionComponent } from "react";
import { theme } from "../../../theme/theme";

interface Props {
  value: number;
  max: number;
}

const ProgressBarFill = styled.div<{ $widthPercent: number }>`
  height: 6px;
  border-radius: ${theme.borderRadius.xs};
  width: ${(props) => props.$widthPercent}%;
  background-color: ${(props) => {
    if (props.$widthPercent >= 100) {
      return theme.colors.status.error.main;
    }
    if (props.$widthPercent >= 90) {
      return theme.colors.status.warning.main;
    }
    return theme.colors.primary.main;
  }};
`;

const ProgressBarTrack = styled.div`
  height: 6px;
  border-radius: ${theme.borderRadius.xs};
  background-color: ${theme.colors.border.light};
`;

export const ProgressBar: FunctionComponent<Props> = ({ value, max }) => {
  return (
    <ProgressBarTrack>
      <ProgressBarFill $widthPercent={(value / max) * 100} />
    </ProgressBarTrack>
  );
};

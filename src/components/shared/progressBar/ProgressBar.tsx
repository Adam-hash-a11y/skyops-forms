import styled from "styled-components";
import type { FunctionComponent } from "react";

interface Props {
  value: number;
  max: number;
}

const ProgressBarFill = styled.div<{ $widthPercent: number }>`
  height: 6px;
  border-radius: 3px;
  width: ${(props) => props.$widthPercent}%;
  background-color: ${(props) => {
    if (props.$widthPercent >= 100) {
      return "#c0262d";
    }
    if (props.$widthPercent >= 90) {
      return "#d98a00";
    }
    return "#1b63d6";
  }};
`;

const ProgressBarTrack = styled.div`
  height: 6px;
  border-radius: 3px;
  background-color: #edf0f5;
`;

export const ProgressBar: FunctionComponent<Props> = ({ value, max }) => {
  return (
    <ProgressBarTrack>
      <ProgressBarFill $widthPercent={(value / max) * 100} />
    </ProgressBarTrack>
  );
};

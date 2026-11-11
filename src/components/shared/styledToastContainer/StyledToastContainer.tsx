import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import { theme } from "../../../theme/theme";

export const StyledToastContainer = styled(ToastContainer)`
  --toastify-z-index: ${theme.zIndex.toast};

  .Toastify__toast {
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing[12]} ${theme.spacing[16]};
    font-family: inherit;
    font-size: ${theme.fontSizes.md};
    box-shadow: ${theme.shadows.toast};
  }

  .Toastify__toast-icon svg {
    fill: currentColor;
  }

  .Toastify__close-button {
    color: inherit;
  }

  .Toastify__toast--success {
    background: ${theme.colors.status.success.background};
    color: ${theme.colors.status.success.text};
  }

  .Toastify__toast--error {
    background: ${theme.colors.status.error.background};
    color: ${theme.colors.status.error.text};
  }

  .Toastify__toast--warning {
    background: ${theme.colors.status.warning.background};
    color: ${theme.colors.status.warning.text};
  }

  .Toastify__toast--info {
    background: ${theme.colors.status.info.background};
    color: ${theme.colors.status.info.text};
  }

  .Toastify__progress-bar--success {
    background: ${theme.colors.status.success.text};
  }

  .Toastify__progress-bar--error {
    background: ${theme.colors.status.error.text};
  }

  .Toastify__progress-bar--warning {
    background: ${theme.colors.status.warning.text};
  }

  .Toastify__progress-bar--info {
    background: ${theme.colors.status.info.text};
  }
`;

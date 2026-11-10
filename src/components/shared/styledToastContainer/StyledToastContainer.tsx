import styled from "styled-components";
import { ToastContainer } from "react-toastify";

export const StyledToastContainer = styled(ToastContainer)`
  --toastify-z-index: 10000;

  .Toastify__toast {
    border-radius: 8px;
    padding: 12px 16px;
    font-family: inherit;
    font-size: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }

  .Toastify__toast-icon svg {
    fill: currentColor;
  }

  .Toastify__close-button {
    color: inherit;
  }

  .Toastify__toast--success {
    background: #e3f4ea;
    color: #17653d;
  }

  .Toastify__toast--error {
    background: #fde8e8;
    color: #a4202a;
  }

  .Toastify__toast--warning {
    background: #fff1d6;
    color: #8a4b00;
  }

  .Toastify__toast--info {
    background: #e7f0fd;
    color: #144aa0;
  }

  .Toastify__progress-bar--success {
    background: #17653d;
  }

  .Toastify__progress-bar--error {
    background: #a4202a;
  }

  .Toastify__progress-bar--warning {
    background: #8a4b00;
  }

  .Toastify__progress-bar--info {
    background: #144aa0;
  }
`;

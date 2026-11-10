import { createGlobalStyle } from "styled-components";
import { theme } from "../theme/theme";

export const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fontFamily};
    background-color: ${theme.colors.background.main};
    color: ${theme.colors.text.primary};
  }
`;

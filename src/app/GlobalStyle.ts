import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "IBM Plex Sans", system-ui, sans-serif;
    background-color: #F2F4F8;
    color: #162033;
  }
`;

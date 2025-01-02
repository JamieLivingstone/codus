import { MantineProvider, createTheme } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#222429',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  defaultGradient: {
    from: 'blue',
    to: 'cyan',
    deg: 45,
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <h1>Hello World</h1>
    </MantineProvider>
  </React.StrictMode>,
);

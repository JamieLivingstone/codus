import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './router';
import './i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <RouterProvider router={router} defaultPreload="intent" />
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>,
);

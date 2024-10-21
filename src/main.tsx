import { MantineProvider } from '@mantine/core';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';

import { router } from './router.tsx';
import './i18n.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
);

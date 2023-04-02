import React from 'react';
import ErrorBoundary from './pages/ErrorBoundary';
import IndexPage, { loader as indexLoader } from './pages/Index.page';
import './index.css';

export const routes = [
  {
    path: '*',
    loader: async () => await indexLoader(),
    element: <IndexPage />,
    errorElement: <ErrorBoundary />,
  },
];

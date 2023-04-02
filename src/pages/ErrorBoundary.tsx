import React from 'react';
import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary(): JSX.Element {
  const error = useRouteError() as {
    statusText?: string | null;
    message?: string | null;
  };
  //console.error(error);

  return (
    <div id="error-page" data-testid="error-boundary-display">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText ?? error.message}</i>
      </p>
    </div>
  );
}

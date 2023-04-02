import React from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';
import * as api from '../data/api';

export async function loader(): Promise<any> {
  return defer({
    baseContent: await api.getBaseContent(),
    fullContent: api.getFullContent(), // TODO remove the await here to see the bug on the browser console.
  });
}

export default function IndexPage(): JSX.Element {
  const data = useLoaderData() as {
    baseContent: { site: { name: string } };
    fullContent: any;
  };

  return (
    <>
      <div id="sidebar">
        <h1>{data.baseContent.site.name}</h1>
        <p>
          The page should load with the base content (on the sidebar) and then load the full content (displayed on the
          right side) async.
        </p>
        <p>
          To see the bug, remove the <code>await</code> that is before the <code>api.getFullContent()</code> in the{' '}
          <code>Index.loader()</code>. Then open your browser console and you will see the error.
        </p>
      </div>
      <div id="detail">
        <React.Suspense fallback={<p>Loading...</p>}>
          <Await resolve={data.fullContent} errorElement={<p>Error loading full content!</p>}>
            {(fullContent) => (
              <>
                <p>{fullContent.intro || 'fullContent.intro not loaded'}</p>
                <img src={fullContent.image} alt="fullContent.image not loaded" width={100} />
              </>
            )}
          </Await>
        </React.Suspense>
      </div>
    </>
  );
}

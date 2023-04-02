// Mock awaited API request
export const getBaseContent = async (): Promise<any> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        site: {
          name: 'POC SSR with Defer',
        },
      });
    }, 1000);
  });
};

// Mock defered API request
export const getFullContent = async (): Promise<any> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        intro: 'Bla bla bla',
        image: 'https://placehold.co/600x400',
      });
    }, 5000);
  });
};

import tallyPoints from './tallyPoints';

describe('Tally Points function', () => {
  it.todo('should fetch the repos of a user', async () => {

    global.fetch = jest.fn(() => {
      // for fetching the repo, the fetch returns a promise
      Promise.resolve({
        // the data it resolves with contains json which is a
        // function that can be called.
        // We await the response so we need to promise.resolve
        // The data we expect back is...
        json: () => Promise.resolve()
      });
    });
  });

  it.todo('starts off being zero');
  it.todo('increments by 1 for each commit done per day');
})

const getRepos = require('../script');

// import tallyPoints from '../script';

describe('Tally Points function', () => {
  it('should fetch the repos of a user', async () => {
    // All we care about is the name
    const mockRepos = [
      {name: "repo1"},
      {name: "repo2"},
      {name: "repo3"}
    ];
    global.fetch = jest.fn(() => {
      // for fetching the repo, the fetch returns a promise
      Promise.resolve({
        // the data it resolves with contains json which is a
        // function that can be called.
        // We await the response so we need to promise.resolve
        // The data we expect back is an array of objects
        json: () => Promise.resolve(mockRepos)
      });
    });

    const repos = await getRepos();
    expect(repos[0].name).toBe("repo1");
  });

  it.todo('starts off being zero');
  it.todo('increments by 1 for each commit done per day');
})

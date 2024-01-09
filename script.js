
username = 'PercyJacks'

// Function to get all the repos for a particular user
const getRepos = async () => {
  const endpoint = new URL(`https://api.github.com/users/${username}/repos`);
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
};

// For each repo get the most recent commit
const getCommit = async (repo) => {
  const endpoint = new URL(`https://api.github.com/repos/${username}/${repo}/commits`);
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
};

getRepos().then((repos) => {
  for (const repo of repos) {
    getCommit(repo.name).then((commits) => {
      // Check that name matches name of user
      // Check that date matches today's date
    })
  }
})


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

// Get current date
currentDate = new Date();
// Avoid comparing time for current date
currentDate.setHours(0,0,0,0);

getRepos().then((repos) => {
  for (const repo of repos) {
    getCommit(repo.name).then((commits) => {
      let latestCommit = commits[0];
      // Check that name matches name of user
      // For some commits, author is null?? If author is null, assume it was done by user?
      // Check that date matches today's date
      commitDate = new Date(latestCommit.commit.author.date);
      if (currentDate < commitDate) {
        console.log(`Repo: ${repo.name}. Commit Date: ${commitDate.toLocaleDateString()}. This commit is in date. NICE!!!`);
        // Tally points
      } else {
        console.log(`Repo: ${repo.name}. Commit Date: ${commitDate.toLocaleDateString()}. This is an old commit!`);
        // Send email reminder
      }
    });
  }
});

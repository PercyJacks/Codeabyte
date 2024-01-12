
username = 'PercyJacks'
firstname = 'Percy'
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
  return data[0];
};

// Async function to tally Commits
const tallyCommits = async () => {
  let commitsMade = 0;
  // Get current date
  let currentDate = new Date();
  // Avoid comparing time for current date
  currentDate.setHours(0,0,0,0);
  const repos = await getRepos();
  for (const repo of repos) {
    let latestCommit = await getCommit(repo.name);
    let commitAuthorName = latestCommit.commit.author.name;
    if (commitAuthorName.toLowerCase().includes(firstname.toLowerCase())) {
      // Check that date matches today's date
      commitDate = new Date(latestCommit.commit.author.date);
      if (currentDate < commitDate) {
        console.log(`Repo: ${repo.name}. Commit Date: ${commitDate.toLocaleDateString()}. This commit is in date. NICE!!!`);
        // Tally points
        commitsMade += 1;
      } else {
        // Handled elsewhere
        // console.log(`Repo: ${repo.name}. Commit Date: ${commitDate.toLocaleDateString()}. This is an old commit!`);

      }
    }
  }
  return commitsMade;
};

tallyCommits()

// Function to handle notification/email
// Send email/notification reminder
        // alert("Make a commit before the day is over!");

// Function to handle rewards

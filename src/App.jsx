export default function App() {
  // Add functions here
  // Variables
  let username = "PercyJacks";
  let firstname = "Percy";
  let currentDate = new Date();
  // Avoid comparing time for current date
  currentDate.setHours(0, 0, 0, 0);

  // Function to get all the repos for a particular user
  const getRepos = async () => {
    const endpoint = new URL(`https://api.github.com/users/${username}/repos`);
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  };

  // For each repo get the most recent commit
  const getCommit = async (repo) => {
    const endpoint = new URL(
      `https://api.github.com/repos/${username}/${repo}/commits`
    );
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  };

  // Async function to tally points
  const tallyPoints = async () => {
    let commitsMade = 0;
    const repos = await getRepos();
    console.log(repos);
    for (const repo of repos) {
      let commits = await getCommit(repo.name);
      for (const commit of commits) {
        let commitAuthorName = commit.commit.author.name;
        if (commitAuthorName.toLowerCase().includes(firstname.toLowerCase())) {
          // Check that date matches today's date
          let commitDate = new Date(commit.commit.author.date);
          if (currentDate < commitDate) {
            // Tally points
            commitsMade += 1;
          } else {
            // Handled elsewhere
          }
        }
      }
    }
    return commitsMade;
  };

  tallyPoints();

  // How about I create a function that takes in a message to send as a notification? That
  // way it can handle both types of notifications ("good job" | "Make a commit before the day is over")
  // Maybe take in extra kawrgs to add to the notification e.g. option to take in a link
  const notify = (message) => {
    // Figure out how to display the message like a notification in an app
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") {
        new Notification("Codeabyte", {
          body: message,
          icon: "", // Icon for codeabyte maybe?
        });
      }
    });
  };

  // Function to handle rewards
  const handleRewards = async () => {
    // If commitsMade is 1 or more, send a notification
    const commitsMade = await tallyPoints();
    // Replace the alerts with notifyMessage function
    if (commitsMade >= 1) {
      notify("Good Job! You have made a commit today.");
    } else {
      notify("Make a commit before the day is over.");
      // Maybe put time that is left in the message? e.g. 7 hours left...
    }
  };

  return handleRewards();
}

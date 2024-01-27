// Variables
let username = "PercyJacks";
let firstname = "Percy";
let currentDate = new Date();

// Avoid comparing time for current date
currentDate.setHours(0, 0, 0, 0);

// helper variables/functions for Streak
let streak = 0;

// Need function to check if dates are equal because
// js doesn't allow direct date equality comparison
const areDatesEqual = (date1, date2) => {
  return !(date1 > date2 || date1 < date2);
};

const dateDifference = (date1, date2) => {
  let dayInMs = 24 * 60 * 60 * 1000;
  return Math.abs(new Date(date1 - date2) / dayInMs);
};

// Function to check if it's a new day.
// Since we only want to calculate the streak daily
const isNewDay = () => {
  let storedDate = new Date(JSON.parse(localStorage.getItem("storedDate")));
  // If the stored date is the current date, it's not a new day
  if (areDatesEqual(storedDate, currentDate)) {
    console.log("IT IS NOT A NEW DAY");
    return false;
  }
  console.log("IT IS A NEW DAY");
  // Store the current date
  localStorage.setItem("storedDate", JSON.stringify(currentDate));
  return true;
};

const loseStreak = () => {
  // If stored date is null, nothing has happened yet
  if (localStorage.getItem("storedDate") == null) {
    return false;
  }

  // If stored date - current date > 1, lose streak
  let storedDate = new Date(JSON.parse(localStorage.getItem("storedDate")));
  return dateDifference(storedDate, currentDate) > 1;
};

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
  for (const repo of repos) {
    let commits = await getCommit(repo.name);
    for (const commit of commits) {
      let commitAuthorName = commit.commit.author.name;
      if (commitAuthorName.toLowerCase().includes(firstname.toLowerCase())) {
        // Check that date matches today's date
        commitDate = new Date(commit.commit.author.date);
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
  if (commitsMade >= 1) {
    notify("Good Job! You have made a commit today.");
    // If it's a new day and you have made a commit then increment streak
    if (isNewDay()) {
      streak = streak + 1;
    }
  } else {
    if (loseStreak()) {
      notify(`You've lost your ${streak} day streak 🥲`);
    }
    notify("Make a commit before the day is over.");
    // Maybe put time that is left in the message? e.g. 7 hours left...
  }
};

handleRewards().then(console.log(streak));

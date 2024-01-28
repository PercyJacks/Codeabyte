// Variables
let username = "PercyJacks";
let firstname = "Percy";
let currentDate = new Date();
let pointsMultiplier = 5;

// Avoid comparing time for current date
currentDate.setHours(0, 0, 0, 0);

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
    // console.log("👎🏾")
    return false;
  }
  // console.log("NEW DAY 👍🏾!")
  // Store the current date
  localStorage.setItem("storedDate", JSON.stringify(currentDate));
  return true;
};

// Function to get the current streak
const getStreak = () => {
  let streak = JSON.parse(localStorage.getItem("streak"));
  // Default value
  if (streak == null) {
    return 0;
  }

  return streak;
};

// Function to set the streak
const setStreak = (value) => {
  localStorage.setItem("streak", JSON.stringify(value));
};

// Function to increment the streak
const incrementStreak = () => {
  let currentStreak = getStreak();
  // increment streak
  currentStreak++;
  setStreak(currentStreak);
};

const resetStreak = () => {
  setStreak(0);
};

// Function to check whether to reset the streak
// Default value of 1 but you can optionally check whether the difference
// between the last commit date and the current date is greater than the
// number of days passed in.
const noStreak = (days = 1) => {
  // If stored date is null, nothing has happened yet
  if (localStorage.getItem("storedDate") == null) {
    return false;
  }

  // If stored date - current date > days, lose streak
  let storedDate = new Date(JSON.parse(localStorage.getItem("storedDate")));
  return dateDifference(storedDate, currentDate) > days;
};

// Function to calculate points
const calculatePoints = (commitsMade) => {
  // Get points
  let storedPoints = JSON.parse(localStorage.getItem("points"));
  let tempPoints;
  // Default value
  if (storedPoints == null) {
    tempPoints = 0;
  }

  tempPoints = storedPoints + commitsMade * pointsMultiplier;
  // Store the points
  localStorage.setItem("points", JSON.stringify(tempPoints));
};

// Function to get all the repos for a particular user
const getRepos = async () => {
  try {
    const endpoint = new URL(`https://api.github.com/users/${username}/repos`);
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// For each repo get the most recent commit
const getCommit = async (repo) => {
  try {
    const endpoint = new URL(
      `https://api.github.com/repos/${username}/${repo}/commits`
    );
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Async function to tally commits
const tallyCommits = async () => {
  try {
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
            // Tally commits
            commitsMade += 1;
          }
        }
      }
    }
    return commitsMade;
  } catch (error) {
    console.log(error);
  }
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
  try {
    // If commitsMade is 1 or more, send a notification
    const commitsMade = await tallyCommits();
    if (commitsMade >= 1) {
      notify("Good Job! You have made a commit today 🙌🏾");
      // If it's a new day and you have made a commit then increment streak
      if (isNewDay()) {
        // Increment streak
        incrementStreak();
        calculatePoints(commitsMade);
      }
    } else {
      if (noStreak()) {
        notify(`You've lost your ${getStreak()} day streak 🥲`);
        resetStreak();
      }
      // notify("Make a commit before the day is over ⏳");
      // Maybe put time that is left in the message? e.g. 7 hours left...
    }

    // notify(`You earned ${localStorage.getItem("points")} points today`);
  } catch (error) {
    console.log(error);
  }
};

handleRewards();
// localStorage.removeItem("storedDate")
// localStorage.removeItem("streak")
// localStorage.clear()
console.log("current streak:", getStreak());
// If no streak for 7 days, send termination message
if (noStreak(7)) {
  notify("These reminders don’t seem to be working. We’ll stop sending them for now.");
}

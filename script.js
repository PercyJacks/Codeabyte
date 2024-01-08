// Testing fetch
fetch("https://api.github.com/users/PercyJacks/repos")
.then((result) => result.json())
.then((data) => {
  console.log(data)
})

// So what can we do with the repo data?
// We can store each repo name
// Then we can fetch the data for each repo?

// What comes in the data for a given repo?
// test ->
fetch("https://api.github.com/repos/PercyJacks/Codeabyte/commits")
.then((result) => result.json())
.then((data) => {
  console.log(data)
  // get type of data?
})
// Get first index (index 0) ['commit']['author'] and grab 'name' and 'date' from the list
// Check that name matches with name of user and that date is today's date
// (will need to extract just date since it comes with time stamp as well)

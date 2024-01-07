// Testing fetch
fetch("https://api.github.com/users/PercyJacks/repos")
.then((result) => result.json())
.then((data) => {
  console.log(data)
})

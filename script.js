/** @type {import('./$types').PageLoad} */
export async function load() {
  const res = await fetch("https://api.github.com/users/PercyJacks/repos");
  const data = await res.json();
  console.log(data);
}

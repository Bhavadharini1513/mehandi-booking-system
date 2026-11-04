// UNIT I - Node core module: https (making a secure request to another server)
// Run:  npm run demo:https      (needs internet access)
const https = require("https");

const options = {
  hostname: "api.github.com",
  path: "/repos/nodejs/node",
  method: "GET",
  headers: { "User-Agent": "mehandi-demo" },
  timeout: 8000,
};

const req = https.request(options, (res) => {
  console.log("Status :", res.statusCode);
  console.log("Type   :", res.headers["content-type"]);

  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    if (res.statusCode !== 200) {
      return console.log("Server answered with an error:", data.slice(0, 120));
    }
    const repo = JSON.parse(data);
    console.log("Repo   :", repo.full_name);
    console.log("Stars  :", repo.stargazers_count);
  });
});

req.on("timeout", () => req.destroy(new Error("request timed out")));
req.on("error", (err) =>
  console.log("Could not reach the server (offline?):", err.message),
);
req.end();

// UNIT I - Node core module: http
// Builds a tiny web server WITHOUT Express to show what Express does for us.
// Run:  npm run demo:http
const http = require("http");

const artists = [
  { id: 1, name: "Priya", service: "Bridal Mehandi" },
  { id: 2, name: "Anitha", service: "Arabic Mehandi" },
];

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Hello from the raw Node http server");
  }

  if (req.method === "GET" && req.url === "/artists") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(artists));
  }

  if (req.method === "POST" && req.url === "/echo") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ youSent: JSON.parse(body) }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(4000, async () => {
  console.log("Server listening on http://localhost:4000\n");

  // call ourselves so the demo finishes on its own
  const get = await fetch("http://localhost:4000/artists");
  console.log("GET /artists ->", get.status, await get.json());

  const post = await fetch("http://localhost:4000/echo", {
    method: "POST",
    body: JSON.stringify({ hello: "mehandi" }),
  });
  console.log("POST /echo   ->", post.status, await post.json());

  const missing = await fetch("http://localhost:4000/nothing");
  console.log("GET /nothing ->", missing.status);

  server.close();
});

// UNIT I - Node core module: fs (file system)
// Run:  npm run demo:fs
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const dir = path.join(__dirname, "tmp-fs-demo");
const file = path.join(dir, "bookings.txt");

(async () => {
  // 1. create a folder
  await fsp.mkdir(dir, { recursive: true });

  // 2. write, append, read (async / promise style)
  await fsp.writeFile(file, "Booking 1: Bridal Mehandi\n");
  await fsp.appendFile(file, "Booking 2: Arabic Mehandi\n");
  console.log("READ  :\n" + (await fsp.readFile(file, "utf8")));

  // 3. synchronous style (blocks the event loop - use only at start-up)
  console.log("EXISTS:", fs.existsSync(file));
  console.log("SIZE  :", fs.statSync(file).size, "bytes");

  // 4. callback style
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.error(err);
    console.log("LINES :", data.trim().split("\n").length);
  });

  // 5. streams - for big files
  await new Promise((resolve) => {
    fs.createReadStream(file, { encoding: "utf8" })
      .on("data", (chunk) => console.log("STREAM:", chunk.length, "chars"))
      .on("end", resolve);
  });

  // 6. list + rename + delete
  console.log("LIST  :", await fsp.readdir(dir));
  await fsp.rename(file, path.join(dir, "orders.txt"));
  await fsp.rm(dir, { recursive: true, force: true });
  console.log("CLEANED UP");
})();

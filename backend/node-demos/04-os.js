// UNIT I - Node core module: os
// Run:  npm run demo:os
const os = require("os");

console.log("Platform      :", os.platform());
console.log("Architecture  :", os.arch());
console.log("Hostname      :", os.hostname());
console.log("CPU cores     :", os.cpus().length);
console.log("CPU model     :", os.cpus()[0].model);
console.log("Total memory  :", (os.totalmem() / 1024 ** 3).toFixed(2), "GB");
console.log("Free memory   :", (os.freemem() / 1024 ** 3).toFixed(2), "GB");
console.log("Uptime        :", Math.round(os.uptime() / 60), "minutes");
console.log("Home folder   :", os.homedir());
console.log("Temp folder   :", os.tmpdir());
console.log("Line ending   :", JSON.stringify(os.EOL));

// UNIT I - Node global object: process
// Run:  npm run demo:process -- --name=Priya
console.log("Node version :", process.version);
console.log("PID          :", process.pid);
console.log("Platform     :", process.platform);
console.log("Current dir  :", process.cwd());
console.log("Memory (RSS) :", (process.memoryUsage().rss / 1024 / 1024).toFixed(1), "MB");

// command line arguments
const args = process.argv.slice(2);
console.log("Arguments    :", args);
const nameArg = args.find((a) => a.startsWith("--name="));
console.log("Hello,", nameArg ? nameArg.split("=")[1] : "stranger");

// environment variables
console.log("NODE_ENV     :", process.env.NODE_ENV || "(not set)");
console.log("PORT         :", process.env.PORT || "(not set)");

// standard output / error
process.stdout.write("Written with stdout.write\n");
process.stderr.write("Written with stderr.write\n");

// events - run code when the program ends / receives a signal
process.on("exit", (code) => console.log("Exiting with code", code));
process.on("SIGINT", () => {
  console.log("Ctrl+C pressed - cleaning up");
  process.exit(0);
});

// next tick queue vs timers
setTimeout(() => console.log("3) setTimeout"), 0);
setImmediate(() => console.log("2) setImmediate"));
process.nextTick(() => console.log("1) nextTick"));

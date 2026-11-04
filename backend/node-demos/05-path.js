// UNIT I - Node core module: path
// Run:  npm run demo:path
const path = require("path");

const file = "/var/www/mehandi/uploads/artist-photo.final.jpg";

console.log("basename       :", path.basename(file));
console.log("basename no ext:", path.basename(file, path.extname(file)));
console.log("dirname        :", path.dirname(file));
console.log("extname        :", path.extname(file));
console.log("join           :", path.join("uploads", "..", "images", "logo.png"));
console.log("resolve        :", path.resolve("uploads", "logo.png"));
console.log("isAbsolute     :", path.isAbsolute(file));
console.log("parse          :", path.parse(file));
console.log("format         :", path.format({ dir: "/uploads", name: "henna", ext: ".png" }));
console.log("relative       :", path.relative("/var/www", file));
console.log("separator      :", path.sep);
console.log("__dirname      :", __dirname);
console.log("__filename     :", path.basename(__filename));

const fs = require("fs");
const path = require("path");
const os = require("os");

const dirs = [
  path.join(os.tmpdir(), "metro-cache"),
  path.join(process.cwd(), "node_modules", ".cache"),
  path.join(process.cwd(), ".expo"),
];

for (const dir of dirs) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log("Removed", dir);
    }
  } catch (err) {
    console.warn("Could not remove", dir, "-", err.message);
  }
}

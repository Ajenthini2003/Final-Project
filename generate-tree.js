const fs = require("fs");
const path = require("path");

const ignoreFolders = ["node_modules", ".git", "dist", "build"];
const includeFiles = [".js", ".jsx", ".json", ".env"];

let output = "";

function walk(dir, prefix = "") {
  const items = fs.readdirSync(dir).filter(f => !ignoreFolders.includes(f));
  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";

    if (stats.isDirectory()) {
      output += prefix + connector + item + "/\n";
      walk(fullPath, prefix + (isLast ? "    " : "│   "));
    } else {
      const ext = path.extname(item);
      if (includeFiles.includes(ext) || ["package.json", "server.js", "vite.config.js"].includes(item)) {
        output += prefix + connector + item + "\n";
      }
    }
  });
}

walk("./");

// Write to file with UTF-8 encoding
fs.writeFileSync("structure.txt", output, { encoding: "utf8" });
console.log("✅ Project tree saved to structure.txt");
const fs = require("fs/promises");
const path = require("path");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const trimmed = raw.trim();
    if (!trimmed) return fallbackValue;
    return JSON.parse(trimmed);
  } catch (err) {
    if (err && err.code === "ENOENT") return fallbackValue;
    throw err;
  }
}

async function writeJsonFile(filePath, value) {
  const dir = path.dirname(filePath);
  await ensureDir(dir);

  const tmpPath = `${filePath}.tmp`;
  const payload = JSON.stringify(value, null, 2);
  await fs.writeFile(tmpPath, payload, "utf8");
  await fs.rename(tmpPath, filePath);
}

module.exports = {
  ensureDir,
  readJsonFile,
  writeJsonFile,
};


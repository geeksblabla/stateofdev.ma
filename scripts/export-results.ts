import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { exportResults } from "@/lib/firebase/database";

function getFileName() {
  const now = new Date();
  return `./scripts/${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}----${now.getUTCHours()}H-${now.getMinutes()}min.json`;
}

function writeToFile(filename: string, data: any) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err: any) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(`[SUCCESS] ${new Date().toISOString()} JSON saved to ${filename}`);
    }
  });
}

function writeToFileSync(filename: string, data: any) {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`[SUCCESS] ${new Date().toISOString()} JSON saved to ${filename}`);
  }
  catch (err) {
    console.error(`[ERROR] Failed to write ${filename}:`, err);
    throw err;
  }
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`[INFO] Created directory: ${dirPath}`);
  }
}

async function run() {
  console.log("exporting results");
  const data = await exportResults();

  // Get output directory from command line args (e.g., --output=results/2025/data)
  const outputArg = process.argv.find(arg => arg.startsWith("--output="));

  if (outputArg) {
    // Structured output mode for results directory
    const outputDir = outputArg.split("=")[1];
    ensureDirectoryExists(outputDir);

    const resultsPath = path.join(outputDir, "results.json");
    writeToFileSync(resultsPath, data);
    console.log(`[INFO] Exported results to structured directory: ${outputDir}`);
  }
  else {
    // Default behavior: timestamped file in scripts/
    writeToFile(getFileName(), data);
  }
}

run().catch((error) => {
  console.error("Error exporting results:", error);
  process.exit(1);
});

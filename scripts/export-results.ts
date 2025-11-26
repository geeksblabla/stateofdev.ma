import fs from "node:fs";
import process from "node:process";
import { exportResults } from "@/lib/firebase/database";

function getFileName() {
  const now = new Date();
  return `./scripts/${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}----${now.getUTCHours()}H-${now.getMinutes()}min.json`;
}

function writeToFile(filename: string, data: any) {
  fs.writeFile(filename, JSON.stringify(data), (err: any) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(`[SUCCESS] ${new Date().toISOString()} JSON saved to ${filename}`);
    }
  });
}

async function run() {
  console.log("exporting results");
  const data = await exportResults();
  writeToFile(getFileName(), data);
}

run().catch((error) => {
  console.error("Error exporting results:", error);
  process.exit(1);
});

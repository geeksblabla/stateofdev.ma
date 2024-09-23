import fs from "fs";
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
    } else {
      console.log(`[SUCCESS] ${new Date()} JSON saved to ${filename}`);
    }
  });
}

const run = async () => {
  console.log("exporting results");
  const data = await exportResults();
  console.log(data);
  writeToFile(getFileName(), data);
};

run();

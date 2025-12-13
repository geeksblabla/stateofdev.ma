// this is a simple script to convert the questions from yaml to json so it can be used in the playground and chart component
/* eslint-disable node/prefer-global/process */

import type {
  SurveyQuestion,
  SurveyQuestionsYamlFile
} from "../src/lib/validators/survey-schema";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { SURVEY_DIR } from "../src/lib/validators/constants";
import {
  formatValidationReport,
  validateAllSurveyFiles
} from "../src/lib/validators/survey-validator";

async function generate() {
  console.log("Starting survey questions generation...\n");

  // Phase 1: Validate all survey files
  console.log("Phase 1: Validating all survey YAML files...");
  const validationReport = validateAllSurveyFiles(SURVEY_DIR);

  console.log(formatValidationReport(validationReport));

  if (!validationReport.success) {
    console.error(
      "\n❌ Validation failed! Please fix the errors above before generating questions.json"
    );
    process.exit(1);
  }

  console.log("✓ All survey files validated successfully!\n");

  // Phase 2: Generate questions.json
  console.log("Phase 2: Generating questions.json...");

  const QS: Record<string, SurveyQuestion> = {};

  try {
    const files = fs
      .readdirSync(SURVEY_DIR)
      .filter(file => file.endsWith(".yml"))
      .sort();

    const data: SurveyQuestionsYamlFile[] = [];

    for (const file of files) {
      const filepath = path.join(SURVEY_DIR, file);
      const content = fs.readFileSync(filepath, "utf8");
      const parsed = yaml.load(content) as SurveyQuestionsYamlFile;
      data.push(parsed);
    }

    data.forEach(({ label, questions }) => {
      questions.forEach((element, index: number) => {
        const id = `${label}-q-${index}`;
        console.log(`  Generated: ${id}`);
        QS[id] = {
          ...element,
          multiple: element.multiple ?? false, // default to false
          required: element.required ?? true // default to true
        };
      });
    });

    // Get output directory from command line args (e.g., --output=results/2025/data)
    const outputArg = process.argv.find(arg => arg.startsWith("--output="));
    const outputPath = outputArg
      ? path.join(outputArg.split("=")[1], "questions.json")
      : "./scripts/questions.json";

    writeToFile(outputPath, QS);

    console.log(
      `\n✓ Successfully generated ${Object.keys(QS).length} questions`
    );
  }
  catch (e) {
    console.error("\n❌ Error generating questions:", e);
    process.exit(1);
  }
}

function writeToFile(filename: string, data: Record<string, SurveyQuestion>) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err: any) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(`[SUCCESS] ${new Date().toISOString()} JSON saved to ${filename}`);
    }
  });
}

generate().catch((error) => {
  console.error("Error generating questions:", error);
  process.exit(1);
});

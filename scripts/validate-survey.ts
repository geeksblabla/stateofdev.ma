/**
 * Standalone script to validate all survey YAML files
 * This can be run independently or as part of the build process
 */
/* eslint-disable node/prefer-global/process */

import { SURVEY_DIR } from "../src/lib/validators/constants";
import {
  formatValidationReport,
  validateAllSurveyFiles
} from "../src/lib/validators/survey-validator";

async function main() {
  console.log("🔍 Validating survey YAML files...\n");

  const validationReport = validateAllSurveyFiles(SURVEY_DIR);

  console.log(formatValidationReport(validationReport));

  if (validationReport.success) {
    console.log("\n✓ All validations passed!");
    process.exit(0);
  }
  else {
    console.error("\n❌ Validation failed! Please fix the errors above.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error validating survey:", error);
  process.exit(1);
});

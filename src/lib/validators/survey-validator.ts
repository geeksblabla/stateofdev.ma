import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import {
  validateSurveyFile,
  type SurveyQuestionsYamlFile
} from "./survey-schema";

/**
 * Validation result for a single file
 */
export interface FileValidationResult {
  filename: string;
  filepath: string;
  valid: boolean;
  data?: SurveyQuestionsYamlFile;
  errors?: string[];
}

/**
 * Overall validation report
 */
export interface ValidationReport {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  totalQuestions: number;
  fileResults: FileValidationResult[];
  crossFileErrors: string[];
  success: boolean;
}

/**
 * Validates all survey YAML files in a directory
 * @param surveyDir - Directory containing survey YAML files
 * @returns Validation report with detailed results
 */
export function validateAllSurveyFiles(surveyDir: string): ValidationReport {
  const files = fs
    .readdirSync(surveyDir)
    .filter((file) => file.endsWith(".yml"))
    .sort(); // Sort to ensure consistent ordering

  const fileResults: FileValidationResult[] = [];
  const validFiles: SurveyQuestionsYamlFile[] = [];
  let totalQuestions = 0;

  // Phase 1: Validate each file individually
  for (const file of files) {
    const filepath = path.join(surveyDir, file);
    const result: FileValidationResult = {
      filename: file,
      filepath,
      valid: false
    };

    try {
      const content = fs.readFileSync(filepath, "utf8");
      const data = yaml.load(content);

      // Check if data was parsed successfully
      if (!data || typeof data !== "object") {
        throw new Error("Failed to parse YAML file or file is empty");
      }

      // Validate with Zod schema
      const validatedData = validateSurveyFile(data, file);
      result.valid = true;
      result.data = validatedData;
      validFiles.push(validatedData);
      totalQuestions += validatedData.questions.length;

      // Additional file-specific validations
      // Note: Filename validation issues are treated as warnings, not errors
      const filenameWarnings = validateFilename(file, validatedData);

      // Check for multiple "Other" options in questions (warning only)
      const otherWarnings: string[] = [];
      validatedData.questions.forEach((question, index) => {
        const otherChoices = question.choices.filter((c) =>
          /^other/i.test(c.trim())
        );
        if (otherChoices.length > 1) {
          otherWarnings.push(
            `Question ${index + 1} has multiple "Other" variations: ${otherChoices.join(", ")}`
          );
        }
      });

      const allWarnings = [...filenameWarnings, ...otherWarnings];
      if (allWarnings.length > 0) {
        result.errors = allWarnings.map((w) => `Warning: ${w}`);
        // Don't mark as invalid for warnings
      }
    } catch (error) {
      result.valid = false;
      result.errors = [error instanceof Error ? error.message : String(error)];
    }

    fileResults.push(result);
  }

  // Phase 2: Cross-file validation
  const crossFileErrors = performCrossFileValidation(validFiles, files);

  // Generate report
  const validCount = fileResults.filter((r) => r.valid).length;

  // Only count actual errors, not warnings
  const actualCrossFileErrors = crossFileErrors.filter(
    (e) => !e.startsWith("Warning")
  );

  const report: ValidationReport = {
    totalFiles: files.length,
    validFiles: validCount,
    invalidFiles: files.length - validCount,
    totalQuestions,
    fileResults,
    crossFileErrors,
    success: validCount === files.length && actualCrossFileErrors.length === 0
  };

  return report;
}

/**
 * Validates that filename matches the expected pattern and content
 * @param filename - Name of the file
 * @param data - Parsed and validated file data
 * @returns Array of error messages (empty if valid)
 */
function validateFilename(
  filename: string,
  data: SurveyQuestionsYamlFile
): string[] {
  const errors: string[] = [];

  // Expected pattern: {position}-{label}.yml
  const match = filename.match(/^(\d+)-([a-z0-9-]+)\.yml$/);

  if (!match) {
    errors.push(
      `Filename "${filename}" does not match expected pattern: {position}-{label}.yml`
    );
    return errors;
  }

  const [, positionStr, labelFromFilename] = match;
  const positionFromFilename = parseInt(positionStr, 10);

  // Validate position matches
  if (positionFromFilename !== data.position) {
    errors.push(
      `Position mismatch: filename has "${positionFromFilename}" but content has "${data.position}"`
    );
  }

  // Validate label matches
  if (labelFromFilename !== data.label) {
    errors.push(
      `Label mismatch: filename has "${labelFromFilename}" but content has "${data.label}"`
    );
  }

  return errors;
}

/**
 * Performs cross-file validation checks
 * @param files - Array of validated survey files
 * @param filenames - Array of filenames
 * @returns Array of cross-file validation errors
 */
function performCrossFileValidation(
  files: SurveyQuestionsYamlFile[],
  filenames: string[]
): string[] {
  const errors: string[] = [];

  // Check 1: Unique positions across all files
  const positions = files.map((f) => f.position);
  const duplicatePositions = findDuplicates(positions);
  if (duplicatePositions.length > 0) {
    errors.push(`Duplicate positions found: ${duplicatePositions.join(", ")}`);
  }

  // Check 2: Sequential positions (1, 2, 3, ...)
  const sortedPositions = [...positions].sort((a, b) => a - b);
  const expectedPositions = Array.from(
    { length: positions.length },
    (_, i) => i + 1
  );
  if (JSON.stringify(sortedPositions) !== JSON.stringify(expectedPositions)) {
    errors.push(
      `Positions are not sequential. Expected: ${expectedPositions.join(", ")}, Got: ${sortedPositions.join(", ")}`
    );
  }

  // Check 3: Unique labels across all files
  const labels = files.map((f) => f.label);
  const duplicateLabels = findDuplicates(labels);
  if (duplicateLabels.length > 0) {
    errors.push(
      `Duplicate section labels found: ${duplicateLabels.join(", ")}`
    );
  }

  // Check 4: Unique question IDs across all files
  // Question ID format: {section-label}-q-{index}
  const allQuestionIds: string[] = [];
  const questionIdMap = new Map<string, string>(); // questionId -> filename

  files.forEach((file, fileIndex) => {
    file.questions.forEach((_, qIndex) => {
      const questionId = `${file.label}-q-${qIndex}`;
      allQuestionIds.push(questionId);
      questionIdMap.set(questionId, filenames[fileIndex]);
    });
  });

  const duplicateQuestionIds = findDuplicates(allQuestionIds);
  if (duplicateQuestionIds.length > 0) {
    const duplicateDetails = duplicateQuestionIds
      .map((id) => `${id} (in ${questionIdMap.get(id)})`)
      .join(", ");
    errors.push(`Duplicate question IDs found: ${duplicateDetails}`);
  }

  // Check 5: Validate reasonable question distribution
  files.forEach((file, index) => {
    const requiredCount = file.questions.filter(
      (q) => q.required !== false
    ).length;
    const optionalCount = file.questions.length - requiredCount;

    // Warn if section has too many optional questions (> 50%)
    if (optionalCount > requiredCount && file.questions.length > 2) {
      errors.push(
        `Warning in "${filenames[index]}": Section has more optional questions (${optionalCount}) than required (${requiredCount})`
      );
    }

    // Warn if section has very few questions
    if (file.questions.length < 2) {
      errors.push(
        `Warning in "${filenames[index]}": Section has only ${file.questions.length} question(s). Consider adding more questions or merging with another section.`
      );
    }

    // Warn if section has too many questions (potential UX issue)
    if (file.questions.length > 20) {
      errors.push(
        `Warning in "${filenames[index]}": Section has ${file.questions.length} questions. Consider breaking into smaller sections for better UX.`
      );
    }
  });

  // Check 6: Validate choice count consistency for similar questions
  // This helps catch potential data entry errors
  const choiceCountMap = new Map<string, number[]>();
  files.forEach((file, fileIndex) => {
    file.questions.forEach((question, qIndex) => {
      const choiceCount = question.choices.length;
      // Track questions with similar choice counts
      if (!choiceCountMap.has(file.label)) {
        choiceCountMap.set(file.label, []);
      }
      choiceCountMap.get(file.label)!.push(choiceCount);

      // Warn about questions with excessive choices (> 30)
      if (choiceCount > 30) {
        errors.push(
          `Warning in "${filenames[fileIndex]}" question ${qIndex + 1}: Question has ${choiceCount} choices. Consider grouping or simplifying choices.`
        );
      }
    });
  });

  return errors;
}

/**
 * Finds duplicate values in an array
 * @param array - Array to check for duplicates
 * @returns Array of duplicate values
 */
function findDuplicates<T>(array: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();

  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}

/**
 * Formats validation report as a human-readable string
 * @param report - Validation report to format
 * @returns Formatted string report
 */
export function formatValidationReport(report: ValidationReport): string {
  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push("Survey YAML Validation Report");
  lines.push("=".repeat(60));
  lines.push("");

  // Summary
  lines.push("Summary:");
  lines.push(`  Total files: ${report.totalFiles}`);
  lines.push(`  Valid files: ${report.validFiles}`);
  lines.push(`  Invalid files: ${report.invalidFiles}`);
  lines.push(`  Total questions: ${report.totalQuestions}`);
  lines.push(`  Status: ${report.success ? "✓ PASSED" : "✗ FAILED"}`);
  lines.push("");

  // File-level results
  if (report.fileResults.length > 0) {
    lines.push("File Validation Results:");
    lines.push("-".repeat(60));

    for (const result of report.fileResults) {
      const status = result.valid ? "✓" : "✗";
      lines.push(`${status} ${result.filename}`);

      if (result.data) {
        lines.push(
          `    Position: ${result.data.position}, Label: ${result.data.label}`
        );
        lines.push(`    Questions: ${result.data.questions.length}`);
      }

      if (result.errors && result.errors.length > 0) {
        lines.push("    Errors:");
        result.errors.forEach((error) => {
          lines.push(`      - ${error}`);
        });
      }
      lines.push("");
    }
  }

  // Cross-file validation errors
  if (report.crossFileErrors.length > 0) {
    lines.push("Cross-File Validation Issues:");
    lines.push("-".repeat(60));
    report.crossFileErrors.forEach((error) => {
      // Distinguish between errors and warnings
      const isWarning = error.startsWith("Warning");
      const prefix = isWarning ? "⚠" : "✗";
      lines.push(`${prefix} ${error}`);
    });
    lines.push("");
  }

  lines.push("=".repeat(60));

  return lines.join("\n");
}

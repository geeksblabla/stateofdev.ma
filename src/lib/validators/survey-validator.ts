import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import {
  validateSurveyFile,
  type SurveyQuestionsYamlFile
} from "./survey-schema";
import {
  VALIDATION_THRESHOLDS,
  ValidationSeverity,
  type ValidationError
} from "./constants";

export interface FileValidationResult {
  filename: string;
  filepath: string;
  valid: boolean;
  data?: SurveyQuestionsYamlFile;
  errors?: ValidationError[];
}

export interface ValidationReport {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  totalQuestions: number;
  fileResults: FileValidationResult[];
  crossFileErrors: ValidationError[];
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

      if (!content.trim()) {
        throw new Error("File is empty");
      }

      const data = yaml.load(content);

      if (!data) {
        throw new Error("YAML parsing returned null or undefined");
      }

      if (typeof data !== "object") {
        throw new Error("YAML file must contain an object");
      }

      const validatedData = validateSurveyFile(data, file);
      result.valid = true;
      result.data = validatedData;
      validFiles.push(validatedData);
      totalQuestions += validatedData.questions.length;

      // Additional file-specific validations
      // Note: Filename validation issues are treated as warnings, not errors
      const filenameWarnings = validateFilename(file, validatedData);

      // Check for multiple "Other" options in questions (warning only)
      const otherWarnings: ValidationError[] = [];
      validatedData.questions.forEach((question, index) => {
        const otherChoices = question.choices.filter((c) =>
          /^other$/i.test(c.trim())
        );
        if (otherChoices.length > 1) {
          otherWarnings.push({
            severity: ValidationSeverity.WARNING,
            message: `Question ${index + 1} has multiple "Other" variations: ${otherChoices.join(", ")}`,
            path: `questions[${index}].choices`
          });
        }
      });

      // Check for question mark style issues (warning only)
      const questionMarkWarnings: ValidationError[] = [];
      validatedData.questions.forEach((question, index) => {
        const questionMarks = (question.label.match(/\?/g) || []).length;

        if (questionMarks > 1) {
          questionMarkWarnings.push({
            severity: ValidationSeverity.WARNING,
            message: `Question ${index + 1} has multiple question marks`,
            path: `questions[${index}].label`,
            value: question.label
          });
        } else if (
          questionMarks === 1 &&
          !question.label.trim().endsWith("?")
        ) {
          questionMarkWarnings.push({
            severity: ValidationSeverity.WARNING,
            message: `Question ${index + 1} has question mark not at end`,
            path: `questions[${index}].label`,
            value: question.label
          });
        }
      });

      const allWarnings = [
        ...filenameWarnings,
        ...otherWarnings,
        ...questionMarkWarnings
      ];
      if (allWarnings.length > 0) {
        result.errors = allWarnings;
        // Don't mark as invalid for warnings
      }
    } catch (error) {
      result.valid = false;
      result.errors = [
        {
          severity: ValidationSeverity.ERROR,
          message: error instanceof Error ? error.message : String(error)
        }
      ];
    }

    fileResults.push(result);
  }

  // Phase 2: Cross-file validation
  const crossFileErrors = performCrossFileValidation(validFiles, files);

  // Generate report
  const validCount = fileResults.filter((r) => r.valid).length;

  // Only count actual errors, not warnings
  const actualCrossFileErrors = crossFileErrors.filter(
    (e) => e.severity === ValidationSeverity.ERROR
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
 * @returns Array of validation errors (empty if valid)
 */
function validateFilename(
  filename: string,
  data: SurveyQuestionsYamlFile
): ValidationError[] {
  const errors: ValidationError[] = [];

  const match = filename.match(/^(\d+)-([a-z0-9-]+)\.yml$/);

  if (!match) {
    errors.push({
      severity: ValidationSeverity.WARNING,
      message: `Filename "${filename}" does not match expected pattern: {position}-{label}.yml`,
      path: "filename"
    });
    return errors;
  }

  const [, positionStr, labelFromFilename] = match;
  const positionFromFilename = parseInt(positionStr, 10);

  if (positionFromFilename !== data.position) {
    errors.push({
      severity: ValidationSeverity.WARNING,
      message: `Position mismatch: filename has "${positionFromFilename}" but content has "${data.position}"`,
      path: "position",
      value: { filename: positionFromFilename, content: data.position }
    });
  }

  if (labelFromFilename !== data.label) {
    errors.push({
      severity: ValidationSeverity.WARNING,
      message: `Label mismatch: filename has "${labelFromFilename}" but content has "${data.label}"`,
      path: "label",
      value: { filename: labelFromFilename, content: data.label }
    });
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
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check 1: Unique positions across all files
  const positions = files.map((f) => f.position);
  const duplicatePositions = findDuplicates(positions);
  if (duplicatePositions.length > 0) {
    errors.push({
      severity: ValidationSeverity.ERROR,
      message: `Duplicate positions found: ${duplicatePositions.join(", ")}`,
      path: "position",
      value: duplicatePositions
    });
  }

  // Check 2: Sequential positions (1, 2, 3, ...)
  const sortedPositions = [...positions].sort((a, b) => a - b);
  const expectedPositions = Array.from(
    { length: positions.length },
    (_, i) => i + 1
  );
  if (JSON.stringify(sortedPositions) !== JSON.stringify(expectedPositions)) {
    errors.push({
      severity: ValidationSeverity.ERROR,
      message: `Positions are not sequential. Expected: ${expectedPositions.join(", ")}, Got: ${sortedPositions.join(", ")}`,
      path: "position",
      value: { expected: expectedPositions, actual: sortedPositions }
    });
  }

  // Check 3: Unique labels across all files
  const labels = files.map((f) => f.label);
  const duplicateLabels = findDuplicates(labels);
  if (duplicateLabels.length > 0) {
    errors.push({
      severity: ValidationSeverity.ERROR,
      message: `Duplicate section labels found: ${duplicateLabels.join(", ")}`,
      path: "label",
      value: duplicateLabels
    });
  }

  // Check 4: Unique question IDs across all files
  // Question ID format: {section-label}-q-{index}
  const allQuestionIds: string[] = [];
  const questionIdMap = new Map<string, string>(); // questionId -> filename

  files.forEach((file, fileIndex) => {
    file.questions.forEach((_, qIndex) => {
      const questionId = `${file.label}-q-${qIndex}`;

      if (!/^[a-z0-9-]+-q-\d+$/.test(questionId)) {
        errors.push({
          severity: ValidationSeverity.ERROR,
          message: `Invalid question ID format: "${questionId}". Expected format: {section-label}-q-{index}`,
          path: `${filenames[fileIndex]}.questions[${qIndex}]`,
          value: questionId
        });
      }

      allQuestionIds.push(questionId);
      questionIdMap.set(questionId, filenames[fileIndex]);
    });
  });

  const duplicateQuestionIds = findDuplicates(allQuestionIds);
  if (duplicateQuestionIds.length > 0) {
    const duplicateDetails = duplicateQuestionIds
      .map((id) => `${id} (in ${questionIdMap.get(id)})`)
      .join(", ");
    errors.push({
      severity: ValidationSeverity.ERROR,
      message: `Duplicate question IDs found: ${duplicateDetails}`,
      path: "questions",
      value: duplicateQuestionIds
    });
  }

  // Check 5: Validate reasonable question distribution
  files.forEach((file, index) => {
    const requiredCount = file.questions.filter(
      (q) => q.required !== false
    ).length;
    const optionalCount = file.questions.length - requiredCount;

    // Warn if section has too many optional questions (> threshold)
    const optionalRatio = optionalCount / file.questions.length;
    if (
      optionalRatio > VALIDATION_THRESHOLDS.OPTIONAL_RATIO_WARNING &&
      file.questions.length > VALIDATION_THRESHOLDS.MIN_QUESTIONS_WARNING
    ) {
      errors.push({
        severity: ValidationSeverity.WARNING,
        message: `Section has more optional questions (${optionalCount}) than required (${requiredCount})`,
        path: `${filenames[index]}.questions`,
        value: { required: requiredCount, optional: optionalCount }
      });
    }

    // Warn if section has very few questions
    if (file.questions.length < VALIDATION_THRESHOLDS.MIN_QUESTIONS_WARNING) {
      errors.push({
        severity: ValidationSeverity.WARNING,
        message: `Section has only ${file.questions.length} question(s). Consider adding more questions or merging with another section`,
        path: `${filenames[index]}.questions`,
        value: file.questions.length
      });
    }

    // Warn if section has too many questions (potential UX issue)
    if (file.questions.length > VALIDATION_THRESHOLDS.MAX_QUESTIONS_WARNING) {
      errors.push({
        severity: ValidationSeverity.WARNING,
        message: `Section has ${file.questions.length} questions. Consider breaking into smaller sections for better UX`,
        path: `${filenames[index]}.questions`,
        value: file.questions.length
      });
    }
  });

  // Check 6: Validate choice count consistency for similar questions
  // This helps catch potential data entry errors
  const choiceCountMap = new Map<string, number[]>();
  files.forEach((file, fileIndex) => {
    file.questions.forEach((question, qIndex) => {
      const choiceCount = question.choices.length;
      if (!choiceCountMap.has(file.label)) {
        choiceCountMap.set(file.label, []);
      }
      choiceCountMap.get(file.label)!.push(choiceCount);

      if (choiceCount > VALIDATION_THRESHOLDS.MAX_CHOICES_WARNING) {
        errors.push({
          severity: ValidationSeverity.WARNING,
          message: `Question ${qIndex + 1} has ${choiceCount} choices. Consider grouping or simplifying choices`,
          path: `${filenames[fileIndex]}.questions[${qIndex}].choices`,
          value: choiceCount
        });
      }
    });
  });

  // Check 7: Validate showIf cross-references
  // Build position map: questionId -> { sectionPosition, questionIndex }
  const questionPositionMap = new Map<
    string,
    { sectionPosition: number; questionIndex: number }
  >();

  files.forEach((file) => {
    file.questions.forEach((_, qIndex) => {
      const questionId = `${file.label}-q-${qIndex}`;
      questionPositionMap.set(questionId, {
        sectionPosition: file.position,
        questionIndex: qIndex
      });
    });
  });

  // Validate section-level showIf references
  files.forEach((file, fileIndex) => {
    if (file.showIf?.question) {
      const refId = file.showIf.question;
      const refPosition = questionPositionMap.get(refId);

      if (!refPosition) {
        errors.push({
          severity: ValidationSeverity.ERROR,
          message: `Section showIf references non-existent question "${refId}"`,
          path: `${filenames[fileIndex]}.showIf.question`,
          value: refId
        });
      } else if (refPosition.sectionPosition >= file.position) {
        errors.push({
          severity: ValidationSeverity.ERROR,
          message: `Section showIf references question "${refId}" which is not in a previous section (references must point backward)`,
          path: `${filenames[fileIndex]}.showIf.question`,
          value: {
            referenced: refId,
            refSection: refPosition.sectionPosition,
            currentSection: file.position
          }
        });
      }
    }

    // Validate question-level showIf references
    file.questions.forEach((question, qIndex) => {
      if (question.showIf?.question) {
        const refId = question.showIf.question;
        const refPosition = questionPositionMap.get(refId);
        const currentQuestionId = `${file.label}-q-${qIndex}`;

        if (!refPosition) {
          errors.push({
            severity: ValidationSeverity.ERROR,
            message: `Question showIf references non-existent question "${refId}"`,
            path: `${filenames[fileIndex]}.questions[${qIndex}].showIf.question`,
            value: refId
          });
        } else {
          // Check if reference points backward (earlier section or earlier in same section)
          const isEarlierSection = refPosition.sectionPosition < file.position;
          const isSameSectionEarlierQuestion =
            refPosition.sectionPosition === file.position &&
            refPosition.questionIndex < qIndex;

          if (!isEarlierSection && !isSameSectionEarlierQuestion) {
            errors.push({
              severity: ValidationSeverity.ERROR,
              message: `Question showIf references "${refId}" which does not come before "${currentQuestionId}" (references must point backward)`,
              path: `${filenames[fileIndex]}.questions[${qIndex}].showIf.question`,
              value: {
                referenced: refId,
                current: currentQuestionId
              }
            });
          }
        }
      }
    });
  });

  return errors;
}

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

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

/**
 * Formats validation report as a human-readable string with colors
 * @param report - Validation report to format
 * @returns Formatted string report with ANSI colors
 */
export function formatValidationReport(report: ValidationReport): string {
  const lines: string[] = [];

  lines.push(`${colors.bright}${"=".repeat(60)}${colors.reset}`);
  lines.push(
    `${colors.bright}${colors.cyan}Survey YAML Validation Report${colors.reset}`
  );
  lines.push(`${colors.bright}${"=".repeat(60)}${colors.reset}`);
  lines.push("");

  // Summary
  lines.push(`${colors.bright}Summary:${colors.reset}`);
  lines.push(
    `  Total files: ${colors.cyan}${report.totalFiles}${colors.reset}`
  );
  lines.push(
    `  Valid files: ${colors.green}${report.validFiles}${colors.reset}`
  );
  lines.push(
    `  Invalid files: ${colors.red}${report.invalidFiles}${colors.reset}`
  );
  lines.push(
    `  Total questions: ${colors.cyan}${report.totalQuestions}${colors.reset}`
  );
  const statusColor = report.success ? colors.green : colors.red;
  const statusText = report.success ? "✓ PASSED" : "✗ FAILED";
  lines.push(`  Status: ${statusColor}${statusText}${colors.reset}`);
  lines.push("");

  // File-level results
  if (report.fileResults.length > 0) {
    lines.push(`${colors.bright}File Validation Results:${colors.reset}`);
    lines.push("-".repeat(60));

    for (const result of report.fileResults) {
      const statusColor = result.valid ? colors.green : colors.red;
      const status = result.valid ? "✓" : "✗";
      lines.push(
        `${statusColor}${status}${colors.reset} ${colors.bright}${result.filename}${colors.reset}`
      );

      if (result.data) {
        lines.push(
          `    Position: ${colors.cyan}${result.data.position}${colors.reset}, Label: ${colors.cyan}${result.data.label}${colors.reset}`
        );
        lines.push(
          `    Questions: ${colors.cyan}${result.data.questions.length}${colors.reset}`
        );
      }

      if (result.errors && result.errors.length > 0) {
        lines.push("    Issues:");
        result.errors.forEach((error) => {
          const errorColor =
            error.severity === ValidationSeverity.ERROR
              ? colors.red
              : colors.yellow;
          const prefix =
            error.severity === ValidationSeverity.ERROR ? "✗" : "⚠";
          const pathInfo = error.path ? ` [${error.path}]` : "";
          lines.push(
            `      ${errorColor}${prefix}${colors.reset} ${error.message}${pathInfo}`
          );
        });
      }
      lines.push("");
    }
  }

  // Cross-file validation errors
  if (report.crossFileErrors.length > 0) {
    lines.push(`${colors.bright}Cross-File Validation Issues:${colors.reset}`);
    lines.push("-".repeat(60));
    report.crossFileErrors.forEach((error) => {
      // Distinguish between errors and warnings by severity
      const errorColor =
        error.severity === ValidationSeverity.ERROR
          ? colors.red
          : colors.yellow;
      const prefix = error.severity === ValidationSeverity.ERROR ? "✗" : "⚠";
      const pathInfo = error.path ? ` [${error.path}]` : "";
      lines.push(
        `${errorColor}${prefix}${colors.reset} ${error.message}${pathInfo}`
      );
    });
    lines.push("");
  }

  lines.push(`${colors.bright}${"=".repeat(60)}${colors.reset}`);

  return lines.join("\n");
}

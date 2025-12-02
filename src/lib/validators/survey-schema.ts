import { z } from "zod";
import { VALIDATION_THRESHOLDS } from "./constants";

// Re-export constants for backward compatibility
const MIN_CHOICES = VALIDATION_THRESHOLDS.MIN_CHOICES;
const MIN_LABEL_LENGTH = VALIDATION_THRESHOLDS.MIN_LABEL_LENGTH;
const MIN_TITLE_LENGTH = VALIDATION_THRESHOLDS.MIN_TITLE_LENGTH;
const MAX_LABEL_LENGTH = VALIDATION_THRESHOLDS.MAX_LABEL_LENGTH;
const MAX_CHOICE_LENGTH = VALIDATION_THRESHOLDS.MAX_CHOICE_LENGTH;

// Schema for conditional visibility (showIf)
export const ShowIfConditionSchema = z
  .object({
    question: z
      .string()
      .regex(
        /^[a-z0-9-]+-q-\d+$/,
        "Question ID must be in format: {section-label}-q-{index}"
      ),
    equals: z.number().int().nonnegative().optional(),
    notEquals: z.number().int().nonnegative().optional(),
    in: z.array(z.number().int().nonnegative()).min(1).optional(),
    notIn: z.array(z.number().int().nonnegative()).min(1).optional()
  })
  .refine(
    (data) => {
      const operators = [
        data.equals !== undefined,
        data.notEquals !== undefined,
        data.in !== undefined,
        data.notIn !== undefined
      ].filter(Boolean);
      return operators.length === 1;
    },
    {
      message:
        "Exactly one operator must be specified: equals, notEquals, in, or notIn"
    }
  );

export const SurveyQuestionSchema = z.object({
  label: z
    .string()
    .trim()
    .min(MIN_LABEL_LENGTH, "Question label must be at least 3 characters")
    .max(
      MAX_LABEL_LENGTH,
      `Question label must not exceed ${MAX_LABEL_LENGTH} characters`
    )
    .refine(val => val.trim().length > 0, {
      message: "Question label cannot be empty or whitespace only"
    }),

  required: z.boolean().optional().default(false),

  multiple: z.boolean().optional().default(false),

  choices: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Choice must not be empty")
        .max(
          MAX_CHOICE_LENGTH,
          `Choice must not exceed ${MAX_CHOICE_LENGTH} characters`
        )
        .refine(val => val.trim().length > 0, {
          message: "Choice cannot be whitespace only"
        })
    )
    .min(MIN_CHOICES, `Each question must have at least ${MIN_CHOICES} choices`)
    .refine(
      (choices) => {
        // Check for duplicate choices (case-insensitive)
        const lowerCaseChoices = choices.map(c => c.toLowerCase().trim());
        const uniqueChoices = new Set(lowerCaseChoices);
        return uniqueChoices.size === lowerCaseChoices.length;
      },
      {
        message: "Duplicate choices detected (case-insensitive comparison)"
      }
    ),
  // Note: Multiple "Other" variations are handled as warnings in cross-file validation

  showIf: ShowIfConditionSchema.optional()
});

export const SurveyFileSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(MIN_TITLE_LENGTH, "Section title must be at least 2 characters")
      .refine(val => val.trim().length > 0, {
        message: "Section title cannot be empty or whitespace only"
      }),

    label: z
      .string()
      .trim()
      .min(MIN_TITLE_LENGTH, "Section label must be at least 2 characters")
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "Section label must be in kebab-case format (lowercase, hyphens only)"
      )
      .refine(val => val.trim().length > 0, {
        message: "Section label cannot be empty or whitespace only"
      }),

    position: z
      .number()
      .int("Position must be an integer")
      .positive("Position must be a positive number")
      .min(1, "Position must start from 1"),

    questions: z
      .array(SurveyQuestionSchema)
      .min(1, "Survey section must contain at least one question")
      .refine(
        (questions) => {
          // Check for duplicate question labels within the section
          const labels = questions.map(q => q.label.toLowerCase().trim());
          const uniqueLabels = new Set(labels);
          return uniqueLabels.size === labels.length;
        },
        {
          message: "Duplicate question labels detected within the section"
        }
      ),

    showIf: ShowIfConditionSchema.optional()
  })
  .refine(
    (data) => {
      // Validate that at least one question is required
      const requiredCount = data.questions.filter(
        q => q.required !== false
      ).length;
      return requiredCount > 0;
    },
    {
      message:
        "At least one question in the section must be required (or have required: true)"
    }
  );

/**
 * TypeScript types inferred from Zod schemas
 * These replace the types in custom-yaml.d.ts
 */
export type ShowIfCondition = z.infer<typeof ShowIfConditionSchema>;
export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
export type SurveyQuestionsYamlFile = z.infer<typeof SurveyFileSchema>;

/**
 * Helper function to validate a survey file and return typed data
 * @param data - Raw YAML data to validate
 * @param filename - Optional filename for better error messages
 * @returns Validated and typed survey data
 * @throws ZodError with detailed validation errors
 */
export function validateSurveyFile(
  data: unknown,
  filename?: string
): SurveyQuestionsYamlFile {
  try {
    return SurveyFileSchema.parse(data);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const fileContext = filename ? ` in file "${filename}"` : "";

      // Properly access Zod error issues
      const issues = error.issues;
      const formattedErrors = issues
        .map((err) => {
          // Handle empty path array correctly
          const path
            = err.path && Array.isArray(err.path) && err.path.length > 0
              ? err.path.join(".")
              : "root";
          return `  - ${path}: ${err.message}`;
        })
        .join("\n");

      throw new Error(
        `Survey validation failed${fileContext}:\n${formattedErrors}`,
        { cause: error }
      );
    }
    // Re-throw non-Zod errors with preserved context
    const message = `Unexpected error during validation${(filename != null) ? ` in file "${filename}"` : ""}`;
    throw new Error(
      message
      + (error instanceof Error ? `: ${error.message}` : `: ${String(error)}`),
      { cause: error instanceof Error ? error : undefined }
    );
  }
}

/**
 * Helper function to safely validate without throwing
 * @param data - Raw YAML data to validate
 * @returns Success result with data or failure result with errors
 */
export function validateSurveyFileSafe(data: unknown) {
  return SurveyFileSchema.safeParse(data);
}

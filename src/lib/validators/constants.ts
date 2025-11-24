export const SURVEY_DIR = "./survey";

export const VALIDATION_THRESHOLDS = {
  MIN_LABEL_LENGTH: 3,
  MAX_LABEL_LENGTH: 500,
  MIN_TITLE_LENGTH: 2,
  MAX_CHOICE_LENGTH: 200,
  MIN_CHOICES: 2,
  MAX_CHOICES_WARNING: 30,
  MIN_QUESTIONS_WARNING: 2,
  MAX_QUESTIONS_WARNING: 20,
  OPTIONAL_RATIO_WARNING: 0.5
} as const;

export enum ValidationSeverity {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export interface ValidationError {
  severity: ValidationSeverity;
  message: string;
  path?: string;
  value?: unknown;
}

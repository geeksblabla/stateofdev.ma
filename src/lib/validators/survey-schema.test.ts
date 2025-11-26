import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  SurveyFileSchema,
  SurveyQuestionSchema,
  validateSurveyFile,
  validateSurveyFileSafe
} from "./survey-schema";

describe("surveyQuestionSchema", () => {
  it("validates a valid question", () => {
    const validQuestion = {
      label: "What is your age?",
      required: true,
      multiple: false,
      choices: ["18-24", "25-34", "35-44", "45+"]
    };

    const result = SurveyQuestionSchema.safeParse(validQuestion);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.label).toBe("What is your age?");
      expect(result.data.required).toBe(true);
      expect(result.data.multiple).toBe(false);
      expect(result.data.choices).toHaveLength(4);
    }
  });

  it("applies default values for optional fields", () => {
    const minimalQuestion = {
      label: "Test question?",
      choices: ["Yes", "No"]
    };

    const result = SurveyQuestionSchema.safeParse(minimalQuestion);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.required).toBe(true);
      expect(result.data.multiple).toBe(false);
    }
  });

  it("trims whitespace from label and choices", () => {
    const question = {
      label: "  Test question?  ",
      choices: ["  Choice 1  ", "  Choice 2  "]
    };

    const result = SurveyQuestionSchema.safeParse(question);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.label).toBe("Test question?");
      expect(result.data.choices[0]).toBe("Choice 1");
      expect(result.data.choices[1]).toBe("Choice 2");
    }
  });

  it("rejects question with less than minimum choices", () => {
    const invalidQuestion = {
      label: "Test?",
      choices: ["Only one"]
    };

    const result = SurveyQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("at least 2 choices");
    }
  });

  it("rejects question with empty label", () => {
    const invalidQuestion = {
      label: "",
      choices: ["Yes", "No"]
    };

    const result = SurveyQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it("rejects question with whitespace-only label", () => {
    const invalidQuestion = {
      label: "   ",
      choices: ["Yes", "No"]
    };

    const result = SurveyQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it("rejects question with short label", () => {
    const invalidQuestion = {
      label: "ab",
      choices: ["Yes", "No"]
    };

    const result = SurveyQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it("rejects question with empty choice", () => {
    const invalidQuestion = {
      label: "Test?",
      choices: ["Valid", ""]
    };

    const result = SurveyQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it("rejects question with whitespace-only choice", () => {
    const invalidQuestion = {
      label: "Test?",
      choices: ["Valid", "   "]
    };

    const result = SurveyQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it("rejects question with duplicate choices (case-insensitive)", () => {
    const invalidQuestion = {
      label: "Test?",
      choices: ["Male", "Female", "male"]
    };

    const result = SurveyQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("Duplicate choices");
    }
  });

  it("allows multiple 'Other' variations (handled as warnings elsewhere)", () => {
    const question = {
      label: "Test?",
      choices: ["Option 1", "Other", "Other option"]
    };

    const result = SurveyQuestionSchema.safeParse(question);
    // Multiple "Other" options are now allowed in schema validation
    // They are reported as warnings in the validator instead
    expect(result.success).toBe(true);
  });

  it("allows exactly one 'Other' option", () => {
    const validQuestion = {
      label: "Test?",
      choices: ["Option 1", "Option 2", "Other"]
    };

    const result = SurveyQuestionSchema.safeParse(validQuestion);
    expect(result.success).toBe(true);
  });

  it("allows multiple question marks (warning at validator level)", () => {
    const question = {
      label: "Test?? Really??",
      choices: ["Yes", "No"]
    };

    const result = SurveyQuestionSchema.safeParse(question);
    expect(result.success).toBe(true);
  });
});

describe("surveyFileSchema", () => {
  it("validates a complete valid survey file", () => {
    const validFile = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "What is your age?",
          required: true,
          multiple: false,
          choices: ["18-24", "25-34", "35+"]
        },
        {
          label: "What is your gender?",
          choices: ["Male", "Female", "Other"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(validFile);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Profile");
      expect(result.data.label).toBe("profile");
      expect(result.data.position).toBe(1);
      expect(result.data.questions).toHaveLength(2);
    }
  });

  it("rejects file with empty title", () => {
    const invalidFile = {
      title: "",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "Test?",
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
  });

  it("rejects file with non-kebab-case label", () => {
    const invalidFile = {
      title: "Profile",
      label: "Profile Section",
      position: 1,
      questions: [
        {
          label: "Test?",
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("kebab-case");
    }
  });

  it("accepts valid kebab-case labels", () => {
    const validLabels = [
      "profile",
      "work-experience",
      "tech-stack",
      "learning-and-education",
      "ai"
    ];

    validLabels.forEach((label) => {
      const file = {
        title: "Test",
        label,
        position: 1,
        questions: [
          {
            label: "Test?",
            choices: ["Yes", "No"]
          }
        ]
      };

      const result = SurveyFileSchema.safeParse(file);
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid kebab-case labels", () => {
    const invalidLabels = [
      "Profile",
      "work_experience",
      "tech stack",
      "TECH",
      "tech-",
      "-tech",
      "tech--stack"
    ];

    invalidLabels.forEach((label) => {
      const file = {
        title: "Test",
        label,
        position: 1,
        questions: [
          {
            label: "Test?",
            choices: ["Yes", "No"]
          }
        ]
      };

      const result = SurveyFileSchema.safeParse(file);
      expect(result.success).toBe(false);
    });
  });

  it("rejects file with zero position", () => {
    const invalidFile = {
      title: "Profile",
      label: "profile",
      position: 0,
      questions: [
        {
          label: "Test?",
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
  });

  it("rejects file with negative position", () => {
    const invalidFile = {
      title: "Profile",
      label: "profile",
      position: -1,
      questions: [
        {
          label: "Test?",
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
  });

  it("rejects file with non-integer position", () => {
    const invalidFile = {
      title: "Profile",
      label: "profile",
      position: 1.5,
      questions: [
        {
          label: "Test?",
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
  });

  it("rejects file with no questions", () => {
    const invalidFile = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: []
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("at least one question");
    }
  });

  it("rejects file with duplicate question labels", () => {
    const invalidFile = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "What is your age?",
          choices: ["18-24", "25+"]
        },
        {
          label: "What is your age?",
          choices: ["Young", "Old"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("Duplicate question labels");
    }
  });

  it("rejects file with all optional questions", () => {
    const invalidFile = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "Question 1?",
          required: false,
          choices: ["Yes", "No"]
        },
        {
          label: "Question 2?",
          required: false,
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("At least one question");
      expect(result.error.issues[0]?.message).toContain("required");
    }
  });

  it("accepts file with at least one required question", () => {
    const validFile = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "Question 1?",
          required: true,
          choices: ["Yes", "No"]
        },
        {
          label: "Question 2?",
          required: false,
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(validFile);
    expect(result.success).toBe(true);
  });

  it("accepts file where required is not explicitly set (defaults to true)", () => {
    const validFile = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "Question 1?",
          choices: ["Yes", "No"]
        },
        {
          label: "Question 2?",
          required: false,
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(validFile);
    expect(result.success).toBe(true);
  });
});

describe("validateSurveyFile helper", () => {
  it("validates and returns typed data", () => {
    const validData = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "Test question?",
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = validateSurveyFile(validData);
    expect(result).toBeDefined();
    expect(result.title).toBe("Profile");
    expect(result.questions).toHaveLength(1);
  });

  it("throws error with filename context", () => {
    const invalidData = {
      title: "Profile",
      label: "invalid label",
      position: 1,
      questions: [
        {
          label: "Test?",
          choices: ["Yes", "No"]
        }
      ]
    };

    expect(() => validateSurveyFile(invalidData, "1-profile.yml")).toThrow(
      "1-profile.yml"
    );
  });

  it("throws error with validation details", () => {
    const invalidData = {
      title: "Profile",
      label: "invalid label",
      position: 1,
      questions: []
    };

    expect(() => validateSurveyFile(invalidData)).toThrow();
  });
});

describe("validateSurveyFileSafe helper", () => {
  it("returns success result for valid data", () => {
    const validData = {
      title: "Profile",
      label: "profile",
      position: 1,
      questions: [
        {
          label: "Test question?",
          choices: ["Yes", "No"]
        }
      ]
    };

    const result = validateSurveyFileSafe(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Profile");
    }
  });

  it("returns error result for invalid data", () => {
    const invalidData = {
      title: "",
      label: "profile",
      position: 1,
      questions: []
    };

    const result = validateSurveyFileSafe(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

describe("real-world YAML structure validation", () => {
  it("validates typical survey section structure", () => {
    const typicalSection = {
      title: "AI",
      label: "ai",
      position: 4,
      questions: [
        {
          label:
            "How often do you use AI tools for Dev (Github Copilot, ChatGPT ...)?",
          required: true,
          choices: [
            "Daily",
            "Occasionally",
            "Tried them but not interested",
            "Never"
          ]
        },
        {
          label: "Which AI tools and apps do you use?",
          multiple: true,
          choices: [
            "ChatGPT",
            "Gemini (Google)",
            "Claude (Anthropic)",
            "GitHub Copilot",
            "Cursor",
            "Other"
          ]
        },
        {
          label: "Optional question about AI adoption",
          required: false,
          choices: ["Yes", "No", "Not sure"]
        }
      ]
    };

    const result = SurveyFileSchema.safeParse(typicalSection);
    expect(result.success).toBe(true);
  });
});

describe("edge case tests", () => {
  describe("unicode and special characters", () => {
    it("accepts Unicode characters in labels", () => {
      const question = {
        label: "What programming languages do you use 🚀?",
        choices: ["JavaScript", "Python", "Go"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it("accepts emoji in choice text", () => {
      const question = {
        label: "What is your favorite beverage?",
        choices: ["Coffee ☕", "Tea 🍵", "Water 💧"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it("accepts special characters in choices", () => {
      const question = {
        label: "What framework do you prefer?",
        choices: [
          "React.js",
          "Vue.js (v3+)",
          "Angular (2+)",
          "Svelte & SvelteKit"
        ]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });
  });

  describe("length validation", () => {
    it("rejects label exceeding max length", () => {
      const veryLongLabel = "a".repeat(501);
      const question = {
        label: veryLongLabel,
        choices: ["Yes", "No"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some(i => i.message.includes("500 characters"))).toBe(
          true
        );
      }
    });

    it("accepts label at max length", () => {
      const maxLengthLabel = `${"a".repeat(499)}?`; // 499 chars + 1 for "?" = 500
      const question = {
        label: maxLengthLabel,
        choices: ["Yes", "No"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it("rejects choice exceeding max length", () => {
      const veryLongChoice = "b".repeat(201);
      const question = {
        label: "Test question?",
        choices: ["Valid choice", veryLongChoice]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some(i => i.message.includes("200 characters"))).toBe(
          true
        );
      }
    });

    it("accepts choice at max length", () => {
      const maxLengthChoice = "c".repeat(200);
      const question = {
        label: "Test question?",
        choices: ["Short", maxLengthChoice]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });
  });

  describe("question mark placement", () => {
    it("allows question mark not at the end (warning at validator level)", () => {
      const question = {
        label: "What? is your age",
        choices: ["18-24", "25-34", "35+"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it("accepts question mark at the end", () => {
      const question = {
        label: "What is your age?",
        choices: ["18-24", "25-34", "35+"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it("accepts label without question mark", () => {
      const question = {
        label: "Select your programming languages",
        choices: ["JavaScript", "Python", "Go"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });
  });

  describe("null and undefined handling", () => {
    it("rejects null data", () => {
      const result = SurveyFileSchema.safeParse(null);
      expect(result.success).toBe(false);
    });

    it("rejects undefined data", () => {
      const result = SurveyFileSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });

    it("rejects question with null label", () => {
      const question = {
        label: null,
        choices: ["Yes", "No"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(false);
    });

    it("rejects question with null choices", () => {
      const question = {
        label: "Test?",
        choices: null
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(false);
    });

    it("rejects question with null choice in array", () => {
      const question = {
        label: "Test?",
        choices: ["Valid", null, "Another"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(false);
    });
  });

  describe("complex real-world scenarios", () => {
    it("validates question with long realistic label", () => {
      const question = {
        label:
          "How often do you use AI-powered development tools like GitHub Copilot, ChatGPT, Claude, or similar assistants in your daily development workflow?",
        choices: ["Daily", "Weekly", "Monthly", "Rarely", "Never"]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it("validates choices with technical jargon", () => {
      const question = {
        label: "What backend frameworks do you use?",
        choices: [
          "Express.js/Fastify/Koa",
          "Spring Boot/Micronaut",
          "Django/Flask/FastAPI",
          "Ruby on Rails",
          ".NET Core/ASP.NET",
          "Laravel/Symfony"
        ]
      };

      const result = SurveyQuestionSchema.safeParse(question);
      expect(result.success).toBe(true);
    });

    it("validates multilingual content", () => {
      const file = {
        title: "التعليم والتطوير",
        label: "education",
        position: 2,
        questions: [
          {
            label: "What is your education level?",
            choices: ["Bachelor's", "Master's", "PhD", "Self-taught"]
          }
        ]
      };

      const result = SurveyFileSchema.safeParse(file);
      expect(result.success).toBe(true);
    });
  });
});

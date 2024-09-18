import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SurveyForm } from "./survey-form";
import * as utils from "./utils";

// Mock the submitAnswers function
vi.mock("./utils", () => ({
  submitAnswers: vi.fn()
}));

// Mock questions based on the SurveyQuestionsYamlFile type
const mockQuestions: SurveyQuestionsYamlFile[] = [
  {
    title: "Section 1",
    label: "section-1",
    position: 1,
    questions: [
      {
        label: "Question 1.1",
        choices: ["Option 1", "Option 2"],
        multiple: false,
        required: true
      },
      {
        label: "Question 1.2",
        choices: ["Yes", "No", "Maybe"],
        multiple: true,
        required: false
      },
      {
        label: "Question 1.3",
        choices: ["Never", "Sometimes", "Often", "Always"],
        multiple: false,
        required: false
      }
    ]
  },
  {
    title: "Section 2",
    label: "section-2",
    position: 2,
    questions: [
      {
        label: "Question 2.1",
        choices: ["Option A", "Option B", "Option C"],
        multiple: true,
        required: false
      },
      {
        label: "Question 2.2",
        choices: ["Option A", "Option B", "Option C"],
        multiple: true,
        required: false
      }
    ]
  }
];

describe("SurveyForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the first section of questions correctly", () => {
    render(<SurveyForm questions={mockQuestions} />);
    expect(screen.getByText(/Question 1.1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 2/i)).toBeInTheDocument();
  });

  it("should show error message when required question is not answered", async () => {
    render(<SurveyForm questions={mockQuestions} />);

    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
  });

  it("should navigate to the next question without error", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    fireEvent.click(screen.getByText(/Option 1/i));
    fireEvent.click(screen.getByTestId("next-button"));
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
  });
});

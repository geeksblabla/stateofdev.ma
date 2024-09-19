import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SurveyForm } from "./survey-form";
import * as utils from "./utils";
import { ERRORS } from "./section";

// Mock the submitAnswers function
const submitAnswersSpy = vi
  .spyOn(utils, "submitAnswers")
  .mockImplementation(() =>
    Promise.resolve({
      data: { error: "mocked error" },
      error: undefined
    })
  );

const goToThanksPageSpy = vi
  .spyOn(utils, "goToThanksPage")
  .mockImplementation(() => {});

// Mock questions based on the SurveyQuestionsYamlFile type
const mockQuestions: SurveyQuestionsYamlFile[] = [
  {
    title: "Profile",
    label: "profile",
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
    title: "Education",
    label: "education",
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
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders the first section of questions correctly", () => {
    render(<SurveyForm questions={mockQuestions} />);
    expect(screen.getByText(/Question 1.1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 2/i)).toBeInTheDocument();
    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
  });

  it("should show error message when required question is not answered", async () => {
    render(<SurveyForm questions={mockQuestions} />);

    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
  });

  it("error message should disappear after 2000ms", async () => {
    render(<SurveyForm questions={mockQuestions} />);

    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
    vi.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });
  });

  it("should navigate to the next question without error", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
    fireEvent.click(screen.getByTestId("profile-q-0-0")); // id for the first input of the first question
    fireEvent.click(screen.getByTestId("next-button"));
    expect(screen.getByTestId("profile-q-1")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-0")).toHaveClass("hidden");
  });

  it("show skip button when the question is not required and skip button is working as expected", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    fireEvent.click(screen.getByTestId("profile-q-0-0"));
    expect(screen.queryByTestId("skip-button")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("next-button"));
    expect(screen.getByTestId("skip-button")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("skip-button"));
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
    expect(screen.getByTestId("profile-q-2")).toHaveClass("block");
  });
  it("back button should appear starting from the second question and work as expected", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("profile-q-0-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("back-button"));
    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
  });

  it("In the last question, it should call submitAnswers with correct answers", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    fireEvent.click(screen.getByTestId("profile-q-0-0")); // select the first option of the first question
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-1-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-2-2"));
    fireEvent.click(screen.getByTestId("next-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [0], // this question accept multiple answers
        "profile-q-2": 2
      }
    });

    // check if we are in the education section
    await waitFor(() => {
      expect(screen.getByTestId("education-q-0")).toHaveClass("block");
      expect(screen.getByTestId("education-q-1")).toHaveClass("hidden");
    });
  });

  it("Allow multiple answers for questions with multiple: true", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("profile-q-0-0")); // select the first option of the first question
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-1-0"));
    fireEvent.click(screen.getByTestId("profile-q-1-1"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-2-2"));
    fireEvent.click(screen.getByTestId("next-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [0, 1], // this question accept multiple answers
        "profile-q-2": 2
      }
    });
  });

  it("only allow one answer for questions with multiple: false", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("profile-q-0-0"));
    fireEvent.click(screen.getByTestId("profile-q-0-1"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-1-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-2-2"));
    fireEvent.click(screen.getByTestId("next-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 1, // last selected option
        "profile-q-1": [0], // this question accept multiple answers
        "profile-q-2": 2
      }
    });
  });

  it("on skip question, the selected answer should be null", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    fireEvent.click(screen.getByTestId("profile-q-0-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-1-1"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("skip-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [1],
        "profile-q-2": null
      }
    });
  });
  it("on skip question with multiple: true, the selected answer should be empty array", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    fireEvent.click(screen.getByTestId("profile-q-0-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("skip-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [],
        "profile-q-2": null
      }
    });
  });

  it("Should redirect to thanks page when all questions are answered", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    fireEvent.click(screen.getByTestId("profile-q-0-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-1-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-2-2"));
    fireEvent.click(screen.getByTestId("next-button"));

    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [0], // this question accept multiple answers
        "profile-q-2": 2
      }
    });
    await waitFor(() => {
      expect(screen.getByTestId("education-q-0")).toHaveClass("block");
      expect(screen.getByTestId("education-q-1")).toHaveClass("hidden");
    });
    fireEvent.click(screen.getByTestId("education-q-0-0"));
    fireEvent.click(screen.getByTestId("education-q-0-1"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("education-q-1-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    await waitFor(() => {
      expect(goToThanksPageSpy).toHaveBeenCalled();
    });
  });

  it("Show error message when submitAnswers fails", async () => {
    render(<SurveyForm questions={mockQuestions} />);
    // Mock submitAnswers to return an error
    submitAnswersSpy.mockResolvedValue({
      data: undefined,
      error: {
        type: "mocked error",
        code: "NOT_FOUND",
        status: 500,
        name: "mocked error",
        message: "mocked error"
      }
    });

    fireEvent.click(screen.getByTestId("profile-q-0-0")); // select the first option of the first question
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-1-0"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("profile-q-2-2"));
    fireEvent.click(screen.getByTestId("next-button"));

    expect(screen.getByTestId("profile-q-2")).toHaveClass("block");
    // Check if the error message contains the correct text
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        ERRORS.submission
      );
    });
  });
});

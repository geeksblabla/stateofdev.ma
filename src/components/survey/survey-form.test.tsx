import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SurveyForm } from "./survey-form";
import * as utils from "./utils";
import { ERRORS } from "./section";

function setup(jsx: React.ReactNode) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx)
  };
}

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

const longText = Array(300).fill("a").join("");

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
        choices: ["Yes", "No", "Maybe", "Others"],
        multiple: true,
        required: false
      },
      {
        label: "Question 1.3",
        choices: ["Never", "Sometimes", "Often", "Always", "Other stuff"],
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

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("SurveyForm", () => {
  it("renders the first section of questions correctly", () => {
    render(<SurveyForm questions={mockQuestions} />);
    expect(screen.getByText(/Question 1.1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 2/i)).toBeInTheDocument();
    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
  });

  it("should show error message when required question is not answered", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);

    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    await user.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
  });

  it("error message should disappear after 2000ms", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { user } = setup(<SurveyForm questions={mockQuestions} />);

    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    await user.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
    vi.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  it("should navigate to the next question without error", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
    await user.click(screen.getByTestId("profile-q-0-0")); // id for the first input of the first question
    await user.click(screen.getByTestId("next-button"));
    expect(screen.getByTestId("profile-q-1")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-0")).toHaveClass("hidden");
  });

  it("show skip button when the question is not required and skip button is working as expected", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    await user.click(screen.getByTestId("profile-q-0-0"));
    expect(screen.queryByTestId("skip-button")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("next-button"));
    expect(screen.getByTestId("skip-button")).toBeInTheDocument();
    await user.click(screen.getByTestId("skip-button"));
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
    expect(screen.getByTestId("profile-q-2")).toHaveClass("block");
  });
  it("back button should appear starting from the second question and work as expected", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    await user.click(screen.getByTestId("back-button"));
    expect(screen.getByTestId("profile-q-0")).toHaveClass("block");
    expect(screen.getByTestId("profile-q-1")).toHaveClass("hidden");
  });

  it("In the last question, it should call submitAnswers with correct answers", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    await user.click(screen.getByTestId("profile-q-0-0")); // select the first option of the first question
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-1-0"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-2"));
    await user.click(screen.getByTestId("next-button"));
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

  // test for other input

  it("should show the text area when the user selects the 'other' option for a single choice question", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);

    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    // Select the 'other' option for the 2nd question
    await user.click(screen.getByTestId("profile-q-1-3"));
    // Check if the text area is displayed
    await waitFor(() => {
      expect(screen.getByTestId("profile-q-1-others")).toBeInTheDocument();
    });
  });

  it("should show the text area when the user selects the 'other' option for a multiple choice question", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);

    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    // Select the 'other' option for the 2nd question
    await user.click(screen.getByTestId("profile-q-1-3"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-4"));

    await waitFor(() => {
      expect(screen.getByTestId("profile-q-2-others")).toBeInTheDocument();
    });
    // click multiple choice again
    user.click(screen.getByTestId("profile-q-2-4"));
    await waitFor(() => {
      expect(screen.getByTestId("profile-q-2-others")).toBeInTheDocument();
    });
  });

  it("should include the text area input in the end results", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    // Select the 'other' option for the 2nd question
    await user.click(screen.getByTestId("profile-q-1-3"));

    // Enter text in the text area
    await user.type(screen.getByTestId("profile-q-1-others"), "custom option");
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-3"));
    await user.click(screen.getByTestId("next-button"));

    // Check if submitAnswers is called with the correct answers including the text area input
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [3],
        "profile-q-1-others": "custom option",
        "profile-q-2": 3
      }
    });
  });

  it("should limit the text area input to 200 characters", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    // Select the 'other' option for the 2nd question
    await user.click(screen.getByTestId("profile-q-1-3"));
    // Enter text in the text area
    await user.type(screen.getByTestId("profile-q-1-others"), longText);
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-3"));
    await user.click(screen.getByTestId("next-button"));

    // Check if submitAnswers is called with the correct answers including the text area input
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [3],
        "profile-q-1-others": longText.slice(0, 200),
        "profile-q-2": 3
      }
    });
  });

  it("Allow multiple answers for questions with multiple: true", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("profile-q-0-0")); // select the first option of the first question
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-1-0"));
    await user.click(screen.getByTestId("profile-q-1-1"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-2"));
    await user.click(screen.getByTestId("next-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [0, 1], // this question accept multiple answers
        "profile-q-2": 2
      }
    });
  });

  it("Toggling selection of an option for questions should work as expected with multiple: true", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("profile-q-0-0")); // select the first option of the first question
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-1-0"));
    await user.click(screen.getByTestId("profile-q-1-1")); // click the first option
    await user.click(screen.getByTestId("profile-q-1-1")); // toggle the first option
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-2"));
    await user.click(screen.getByTestId("next-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [0], // this question accept multiple answers
        "profile-q-2": 2
      }
    });
  });

  it("only allow one answer for questions with multiple: false", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("profile-q-0-1"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-1-0"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-2"));
    await user.click(screen.getByTestId("next-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 1, // last selected option
        "profile-q-1": [0], // this question accept multiple answers
        "profile-q-2": 2
      }
    });
  });

  it("on skip question, the selected answer should be null", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-1-1"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("skip-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [1],
        "profile-q-2": null
      }
    });
  });
  it("on skip question with multiple: true, the selected answer should be empty array", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("skip-button"));
    expect(submitAnswersSpy).toHaveBeenCalledWith({
      answers: {
        "profile-q-0": 0,
        "profile-q-1": [],
        "profile-q-2": null
      }
    });
  });

  it("Should redirect to thanks page when all questions are answered", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
    await user.click(screen.getByTestId("profile-q-0-0"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-1-0"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-2"));
    await user.click(screen.getByTestId("next-button"));

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
    await user.click(screen.getByTestId("education-q-0-0"));
    await user.click(screen.getByTestId("education-q-0-1"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("education-q-1-0"));
    await user.click(screen.getByTestId("next-button"));
    await waitFor(() => {
      expect(goToThanksPageSpy).toHaveBeenCalled();
    });
  });

  it("Show error message when submitAnswers fails", async () => {
    const { user } = setup(<SurveyForm questions={mockQuestions} />);
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

    await user.click(screen.getByTestId("profile-q-0-0")); // select the first option of the first question
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-1-0"));
    await user.click(screen.getByTestId("next-button"));
    await user.click(screen.getByTestId("profile-q-2-2"));
    await user.click(screen.getByTestId("next-button"));

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

import React from "react";
import { Controller, useFieldArray, type Control } from "react-hook-form";

import type { PlaygroundFormData } from "./playground-form";
import Select from "react-select";
import type { QuestionMap } from "../chart/data";

// Custom styles for React Select to match flat design
const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: 0,
    borderWidth: "2px",
    borderColor: state.isFocused ? "var(--primary)" : "var(--input)",
    backgroundColor: "var(--card)",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--primary)"
    }
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: 0,
    borderWidth: "2px",
    borderColor: "var(--border)",
    backgroundColor: "var(--card)"
  }),
  option: (base: any, state: any) => ({
    ...base,
    borderRadius: 0,
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
        ? "var(--muted)"
        : "var(--card)",
    color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
    "&:hover": {
      backgroundColor: state.isSelected ? "var(--primary)" : "var(--muted)"
    }
  })
};

type FilterOptionsProps = {
  options: { label: string; value: string }[];
  questions: QuestionMap;
  control: Control<PlaygroundFormData>;
};

export const FilterOptions = React.memo(
  ({ questions, options, control }: FilterOptionsProps) => {
    // not sure why but we need this to make sure filters in the url works as expected
    if (Object.keys(questions).length === 0) {
      return null;
    }
    const { fields, append, remove } = useFieldArray({
      control,
      name: "filters"
    });

    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Filters
        </label>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2">
              <Controller
                name={`filters.${index}`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={options.find(
                          (q) => q.value === value.question_id
                        )}
                        onChange={(val) =>
                          onChange({ question_id: val?.value, values: [] })
                        }
                        inputId="question-select"
                        options={options}
                        placeholder="Select a question"
                        className="w-full "
                        styles={customSelectStyles}
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-destructive hover:opacity-90 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    {value.question_id && (
                      <div className="space-y-2">
                        {questions[value.question_id].choices.map(
                          (choice, choiceIndex) => (
                            <label
                              key={choiceIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                value={choiceIndex.toString()}
                                checked={value.values.includes(
                                  choiceIndex.toString()
                                )}
                                onChange={(e) => {
                                  const newValues = e.target.checked
                                    ? [...value.values, e.target.value]
                                    : value.values.filter(
                                        (v: string) => v !== e.target.value
                                      );
                                  onChange({ ...value, values: newValues });
                                }}
                                className="focus:ring-ring h-4 w-4 text-primary border-2 border-input"
                              />
                              <span className="text-sm text-foreground">
                                {choice}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ question_id: "", values: [] })}
            className="mt-4 px-4 py-2 bg-card text-primary border-2 border-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Filter
          </button>
        </div>
      </div>
    );
  }
);

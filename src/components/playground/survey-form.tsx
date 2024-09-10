import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { type Year, type QuestionMap } from "../report/data";

export type PlaygroundFormData = {
  year: Year;
  questionId: string;
  filters: Array<{ questionId: string; values: string[] }>;
  groupBy: string;
};

export const PlaygroundForm: React.FC<{
  questions: QuestionMap;
  onChange: (data: PlaygroundFormData) => void;
}> = ({ questions, onChange }) => {
  const { control, watch } = useForm<PlaygroundFormData>({
    defaultValues: {
      year: "2020",
      questionId: "",
      filters: [{ questionId: "", values: [] }],
      groupBy: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  return (
    <form className="bg-white shadow-md rounded-lg p-6">
      <div className="space-y-6">
        {/* Year selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {["2020", "2021", "2022", "2023"].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Question selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <Controller
            name="questionId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a question</option>
                {Object.entries(questions).map(([id, question]) => (
                  <option key={id} value={id}>
                    {question.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filters
          </label>
          <Controller
            name="filters"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                {field.value.map((filter, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <select
                        value={filter.questionId}
                        onChange={(e) => {
                          const newFilters = [...field.value];
                          newFilters[index].questionId = e.target.value;
                          newFilters[index].values = [];
                          field.onChange(newFilters);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a question</option>
                        {Object.entries(questions).map(([id, question]) => (
                          <option key={id} value={id}>
                            {question.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const newFilters = [...field.value];
                          newFilters.splice(index, 1);
                          field.onChange(newFilters);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
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
                    {filter.questionId && (
                      <div className="space-y-2">
                        {questions[filter.questionId].choices.map(
                          (choice, choiceIndex) => (
                            <label
                              key={choiceIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                value={choiceIndex.toString()}
                                checked={filter.values.includes(
                                  choiceIndex.toString()
                                )}
                                onChange={(e) => {
                                  const newFilters = [...field.value];
                                  if (e.target.checked) {
                                    newFilters[index].values.push(
                                      e.target.value
                                    );
                                  } else {
                                    newFilters[index].values = newFilters[
                                      index
                                    ].values.filter(
                                      (v) => v !== e.target.value
                                    );
                                  }
                                  field.onChange(newFilters);
                                }}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {choice}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    field.onChange([
                      ...field.value,
                      { questionId: "", values: [] },
                    ])
                  }
                  className="mt-4 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
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
            )}
          />
        </div>

        {/* Group By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group By
          </label>
          <Controller
            name="groupBy"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">No grouping</option>
                {Object.entries(questions).map(([id, question]) => (
                  <option key={id} value={id}>
                    {question.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>
    </form>
  );
};

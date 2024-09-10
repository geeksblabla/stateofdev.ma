import React from "react";
import { Controller, useFieldArray, type Control } from "react-hook-form";

import { type QuestionMap } from "../report/data";

export const FilterOptions: React.FC<{
  questions: QuestionMap;
  control: any;
}> = ({ questions, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <select
                      value={value.questionId}
                      onChange={(e) => {
                        onChange({ questionId: e.target.value, values: [] });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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
                      onClick={() => remove(index)}
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
                  {value.questionId && (
                    <div className="space-y-2">
                      {questions[value.questionId].choices.map(
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
                              className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
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
          onClick={() => append({ questionId: "", values: [] })}
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
    </div>
  );
};

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { type Year, type QuestionMap } from "../report/data";
import { FilterOptions } from "./filters-options";

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
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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
        <FilterOptions questions={questions} control={control} />

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
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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

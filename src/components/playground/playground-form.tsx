import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { type Year, type QuestionMap } from "../chart/data";
import { FilterOptions } from "./filters-options";
import queryString from "query-string";

type Filter = {
  question_id: string;
  values: string[];
};

export type PlaygroundFormData = {
  year: Year;
  question_id: string;
  filters: Filter[];
  group_by: string;
};

const getDefaultValues = (): PlaygroundFormData => {
  const {
    question_id = "profile-q-0",
    group_by = "",
    year = "2023",
    filters: c
  } = queryString.parse(window.location.hash) as unknown as PlaygroundFormData;
  let filters: Filter[] = [];
  try {
    filters = JSON.parse(c as unknown as string);
  } catch (error) {
    filters = [{ question_id: "", values: [] }];
  }

  return { question_id, filters, group_by, year };
};

type PlaygroundFormProps = {
  questions: QuestionMap;
  onChange: (data: PlaygroundFormData) => void;
};

export const PlaygroundForm = React.memo(
  ({ questions, onChange }: PlaygroundFormProps) => {
    console.log(questions);
    console.log(getDefaultValues());
    const { control, watch } = useForm<PlaygroundFormData>({
      defaultValues: getDefaultValues()
    });

    const formData = watch();
    useEffect(() => {
      onChange(formData);
    }, [formData, onChange]);

    useEffect(() => {
      const search = {
        year: formData.year,
        question_id: formData.question_id,
        filters: JSON.stringify(formData.filters),
        group_by: formData.group_by
      };
      window.location.hash = queryString.stringify(search);
    }, [formData]);

    return (
      <form className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-6">
          {/* Year selection */}
          <div>
            <label
              htmlFor="year-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Year
            </label>
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <select
                  id="year-select"
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
            <label
              htmlFor="question-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Question
            </label>
            <Controller
              name="question_id"
              control={control}
              render={({ field }) => (
                <select
                  id="question-select"
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
            <label
              htmlFor="group-by-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Group By
            </label>
            <Controller
              name="group_by"
              control={control}
              render={({ field }) => (
                <select
                  id="group-by-select"
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
  }
);

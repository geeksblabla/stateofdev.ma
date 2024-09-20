import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { type Year, type QuestionMap } from "../chart/data";
import { FilterOptions } from "./filters-options";
import queryString from "query-string";

const isBrowser = typeof window !== "undefined";

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
  } = isBrowser
    ? (queryString.parse(window.location.hash) as unknown as PlaygroundFormData)
    : {
        question_id: "profile-q-0",
        group_by: "",
        year: "2023",
        filters: [{ question_id: "", values: [] }]
      };
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
    console.log(getDefaultValues());
    const { control, watch } = useForm<PlaygroundFormData>({
      defaultValues: getDefaultValues()
    });

    const formData = watch();
    useEffect(() => {
      onChange(formData);
    }, [formData, onChange]);

    useEffect(() => {
      if (isBrowser) {
        const filters = formData.filters.filter((f) => f.values.length > 0);
        const search = {
          year: formData.year,
          question_id: formData.question_id,
          filters: filters.length > 0 ? JSON.stringify(filters) : "",
          group_by: formData.group_by
        };
        window.location.hash = queryString.stringify(search, {
          skipEmptyString: true,
          skipNull: true
        });
      }
    }, [formData]);

    return (
      <div className="border border-gray-200 shadow-sm p-4 rounded-md">
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
      </div>
    );
  }
);

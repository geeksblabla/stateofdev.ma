import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import { type Year, type QuestionMap } from "../chart/data";
import { FilterOptions } from "./filters-options";
import queryString from "query-string";

const isBrowser = typeof window !== "undefined";

export type ChartType = "bar" | "pie";

export const chartTypes: { label: string; value: ChartType }[] = [
  { label: "Bar Chart", value: "bar" },
  { label: "Pie Chart", value: "pie" }
];

const years = ["2020", "2021", "2022", "2023", "2024"];

// Custom styles for React Select to match flat design
const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: 0,
    borderWidth: "2px",
    borderColor: state.isFocused ? "#10b981" : "#d1d5db",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#10b981"
    }
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: 0,
    borderWidth: "2px",
    borderColor: "#d1d5db"
  }),
  option: (base: any, state: any) => ({
    ...base,
    borderRadius: 0,
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
        ? "#d1fae5"
        : "white",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: state.isSelected ? "#10b981" : "#d1fae5"
    }
  })
};

type Filter = {
  question_id: string;
  values: string[];
};

export type PlaygroundFormData = {
  year: Year;
  question_id: string;
  filters: Filter[];
  group_by: string;
  chart_type: string; // Add this line
};

const getDefaultValues = (): PlaygroundFormData => {
  const {
    question_id = "profile-q-0",
    group_by = "",
    year = "2023",
    filters: c,
    chart_type = "bar" // Add this line
  } = isBrowser
    ? (queryString.parse(window.location.hash) as unknown as PlaygroundFormData)
    : {
        question_id: "profile-q-0",
        group_by: "",
        year: "2023",
        filters: [{ question_id: "", values: [] }],
        chart_type: "bar" // Add this line
      };
  let filters: Filter[] = [];
  try {
    filters = JSON.parse(c as unknown as string);
  } catch (error) {
    filters = [{ question_id: "", values: [] }];
  }

  return { question_id, filters, group_by, year, chart_type };
};

type PlaygroundFormProps = {
  questions: QuestionMap;
  onChange: (data: PlaygroundFormData) => void;
};

export const PlaygroundForm = React.memo(
  ({ questions, onChange }: PlaygroundFormProps) => {
    const { control, watch } = useForm<PlaygroundFormData>({
      defaultValues: getDefaultValues()
    });

    const questionOptions = React.useMemo(
      () =>
        Object.entries(questions).map(([id, question]) => ({
          value: id,
          label: question.label
        })),
      [questions]
    );

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
      <div className="border-2 border-gray-200 p-4">
        <div className="space-y-6">
          {/* Year and Chart Type selection */}
          <div className="flex space-x-4">
            <div className="flex-1">
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
                    className="w-full p-2 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="chart-type-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chart Type
              </label>
              <Controller
                name="chart_type"
                control={control}
                render={({ field }) => (
                  <select
                    id="chart-type-select"
                    {...field}
                    className="w-full p-2 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {chartTypes.map((chartType) => (
                      <option key={chartType.value} value={chartType.value}>
                        {chartType.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
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
                <Select
                  {...field}
                  value={questionOptions.find(
                    (q) => q.value === formData.question_id
                  )}
                  onChange={(val) => field.onChange(val?.value)}
                  inputId="question-select"
                  options={questionOptions}
                  placeholder="Select a question"
                  styles={customSelectStyles}
                />
              )}
            />
          </div>

          {/* Filters */}
          <FilterOptions
            questions={questions}
            options={questionOptions}
            control={control}
          />

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
                <Select
                  isClearable
                  {...field}
                  value={questionOptions.find(
                    (q) => q.value === formData.group_by
                  )}
                  onChange={(val) => field.onChange(val?.value)}
                  inputId="group-by-select"
                  options={questionOptions}
                  placeholder="Select a question to group by"
                  styles={customSelectStyles}
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);

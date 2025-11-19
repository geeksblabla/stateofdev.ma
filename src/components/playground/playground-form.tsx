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
      <div className="border-2 border-border p-4">
        <div className="space-y-6">
          {/* Year and Chart Type selection */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="year-select"
                className="block text-sm font-medium text-foreground mb-2"
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
                    className="w-full p-2 border-2 border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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
                className="block text-sm font-medium text-foreground mb-2"
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
                    className="w-full p-2 border-2 border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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
              className="block text-sm font-medium text-foreground mb-2"
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
              className="block text-sm font-medium text-foreground mb-2"
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

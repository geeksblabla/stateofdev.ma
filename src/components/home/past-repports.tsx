const reports = [
  {
    title: "2023",
    link: "/2023",
    takeaways: [
      "Over 91% of participants use AI tools professionally",
      "JavaScript remains most popular, Rust most wanted",
      "80% prefer remote work, full-time or part-time"
    ],
    totalSubmissions: 1764
  },
  {
    title: "2022",
    link: "/2022",
    takeaways: [
      "Remote work adoption reached 80%, with 56% in hybrid mode",
      "JavaScript remains most popular, GoLang most wanted",
      "80%+ have contributed to open-source projects",
      "VSCode is the preferred IDE for 80% of developers"
    ],
    totalSubmissions: 1617
  },
  {
    title: "2021",
    link: "/2021",
    takeaways: [
      "JavaScript remains the most used language",
      "50% of developers consider themselves self-taught",
      "80% of respondents are somewhat happy with their current job"
    ],
    totalSubmissions: 1098
  },
  {
    title: "2020",
    link: "/2020",
    takeaways: [
      "80% of respondents found a job within months of graduation",
      "57% use Windows as their primary OS",
      "60% work on side projects to improve skills",
      "93% think the Moroccan tech community is quite good"
    ],
    totalSubmissions: 2287
  }
];

export const PastReports = () => (
  <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-bold mb-8 text-center">
        Last year's reports
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {reports.map((report, index) => (
          <ReportCard {...report} key={`report-${index}`} />
        ))}
      </div>

      <DataPlaygroundSection />
    </div>
  </section>
);

type ReportCardProps = {
  title: string;
  link: string;
  takeaways: string[];
  totalSubmissions: number;
};

export const ReportCard = ({
  title,
  link,
  takeaways,
  totalSubmissions
}: ReportCardProps) => (
  <a href={link} className="block group relative">
    <div className="bg-white rounded-xl shadow-lg  transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
      <div className="absolute top-4 -left-2 bg-emerald-700 text-white py-1 px-4 rounded-r-lg shadow-md">
        <span className="font-bold">{title}</span>
      </div>

      <div className="p-6 pt-12">
        <h3 className="text-base font-medium  py-4 text-gray-800">
          Total Submissions: {totalSubmissions.toLocaleString()}
        </h3>
        <h3 className="text-base font-medium mb-2  text-gray-800">
          Key Takeaways:
        </h3>
        <ul className="space-y-3 mb-6">
          {takeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-md">
        <span className="text-emerald-700 font-medium group-hover:underline inline-flex items-center">
          Read full report
          <svg
            className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </div>
  </a>
);

const DataPlaygroundSection = () => (
  <div className="mt-16 text-center">
    <h2 className="text-xl font-bold mb-8 text-center">
      Or explore the data yourself!
    </h2>
    <p className="text-gray-600 mb-6">
      Want to dive deeper into the survey results? Try our interactive data
      playground!
    </p>
    <a
      href="/playground"
      className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-colors duration-300"
    >
      Launch Data Playground
      <svg
        className="w-5 h-5 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </a>
  </div>
);

const reports = [
  {
    title: "2023",
    link: "/2023",
    takeaways: [
      "Average salary increased by 15%",
      "React remains the most popular framework",
      "70% of developers contribute to open source"
    ],
    totalSubmissions: 84731
  },
  {
    title: "2022",
    link: "/2022",
    takeaways: [
      "Remote work adoption reached 60%",
      "TypeScript usage grew by 25%",
      "AI/ML skills in high demand"
    ],
    totalSubmissions: 73268
  },
  {
    title: "2021",
    link: "/2021",
    takeaways: [
      "JavaScript is the most used language",
      "44% of developers are self-taught",
      "Cloud technologies saw a 30% increase in adoption"
    ],
    totalSubmissions: 65844
  },
  {
    title: "2020",
    link: "/2020",
    takeaways: [
      "COVID-19 accelerated digital transformation",
      "Cybersecurity became a top priority",
      "Bootcamp graduates increased by 20%"
    ],
    totalSubmissions: 59876
  }
];

export const PastReports = () => (
  <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-bold text-gray-800 mb-12 text-center">
        Last year's reports
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {reports.map((report, index) => (
          <ReportCard {...report} key={`report-${index}`} />
        ))}
      </div>
    </div>
  </section>
);

export const ReportCard = ({
  title,
  link,
  takeaways,
  totalSubmissions
}: {
  title: string;
  link: string;
  takeaways: string[];
  totalSubmissions: number;
}) => (
  <a href={link} className="block group">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>

        <h3 className="text-base font-medium mb-2 text-gray-800">Takeaways:</h3>
        <ul className="space-y-2 mb-6">
          {takeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <span className="text-emerald-600 font-medium group-hover:underline inline-flex items-center">
          Read full report
          <svg
            className="w-4 h-4 ml-1"
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

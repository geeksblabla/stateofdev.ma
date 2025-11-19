const reports = [
  {
    title: "2024",
    link: "/2024",
    takeaways: [
      "AI adoption continues to grow across development teams",
      "TypeScript gaining significant momentum in the ecosystem",
      "Developer experience and tooling remain top priorities"
    ],
    totalSubmissions: 2100
  },
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
  <section className="bg-muted py-24">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-sans font-bold mb-12 text-center">
        Last year's reports
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {reports.map((report, index) => (
          <div className="w-full max-w-md md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
            <ReportCard {...report} key={`report-${index}`} />
          </div>
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
  <a
    href={link}
    className="flex flex-col justify-between h-full group relative bg-card border-2 border-border transition-all duration-300 hover:border-primary hover:-translate-y-1"
  >
    <div className="absolute top-4 -left-2 bg-primary text-primary-foreground py-1 px-4 border-2 border-primary">
      <span className="font-bold">{title}</span>
    </div>

    <div className="p-6 pt-12">
      <h3 className="text-base font-sans font-medium  py-4 text-card-foreground">
        Total Submissions: {totalSubmissions.toLocaleString()}
      </h3>
      <h3 className="text-base font-sans font-medium mb-2  text-card-foreground">
        Key Takeaways:
      </h3>
      <ul className="space-y-3 mb-6">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-5 h-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-muted-foreground text-sm">{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-muted px-6 py-4 flex justify-between items-center border-t border-border">
      <span className="text-primary font-medium inline-flex items-center">
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
  </a>
);

const DataPlaygroundSection = () => (
  <div className="mt-16 text-center">
    <h2 className="text-xl font-sans font-bold mb-8 text-center">
      Or explore the data yourself!
    </h2>
    <p className="text-muted-foreground mb-6">
      Want to dive deeper into the survey results? Try our interactive data
      playground!
    </p>
    <a
      href="/playground"
      className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold border-2 border-primary hover:opacity-90 transition-colors duration-300"
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

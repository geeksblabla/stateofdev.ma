import React from "react";

// SVG Icon components
const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
  >
    <path d="M16.5 7.5h-9v9h9v-9z" />
    <path
      fillRule="evenodd"
      d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75H18A.75.75 0 0118 9h-.75v2.25H18a.75.75 0 010 1.5h-.75V15H18a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z"
      clipRule="evenodd"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
  >
    <path
      fillRule="evenodd"
      d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
      clipRule="evenodd"
    />
    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
  >
    <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
    <path
      fillRule="evenodd"
      d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z"
      clipRule="evenodd"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
  >
    <path
      fillRule="evenodd"
      d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
      clipRule="evenodd"
    />
  </svg>
);

export const Why = () => (
  <div className="relative w-screen z-0">
    <div className="mx-auto py-20 w-full max-w-screen-xl px-4 relative z-[99]">
      <div className="w-20 mb-10 mx-auto border-b-4 border-emerald-700"></div>
      <h2 className="text-xl font-sans font-bold mb-8 text-center">
        Why Join Our Awesome Survey?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Share Knowledge" icon={<BrainIcon />}>
          Be part of creating a global report that sheds light on Morocco's
          development scene. Your insights matter!
        </Card>
        <Card title="Boost Community Impact" icon={<UsersIcon />}>
          Help local communities make informed decisions about learning paths
          and create a bigger impact together.
        </Card>
        <Card title="Get Inspired" icon={<LightbulbIcon />}>
          Discover what others are thinking and find exciting new tools and
          solutions to level up your work.
        </Card>
        <Card title="Spot Market Trends" icon={<ChartIcon />}>
          Stay ahead of the curve with insights on hot technologies and see how
          you stack up against other developers.
        </Card>
      </div>
    </div>
  </div>
);

type CardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Card = ({ title, icon, children }: CardProps) => (
  <div className="bg-white border-2 border-gray-200 p-6 transition-all hover:border-emerald-700 hover:-translate-y-1">
    <div className="flex items-center mb-4">
      <div className="text-emerald-700 mr-4">{icon}</div>
      <h3 className="text-lg font-sans font-medium text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{children}</p>
  </div>
);

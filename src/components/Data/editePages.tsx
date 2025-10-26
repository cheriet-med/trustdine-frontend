import React from 'react';

interface JobCategoryCardProps {
  title: string;
  jobCount: number;
  href?: string;
}

const JobCategoryCard: React.FC<JobCategoryCardProps> = ({ title, href = '#' }) => {
  return (
    <a
      className="group flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800"
      href={href}
    >
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-center gap-x-3">
          <div className="grow">
            <h3 className="group-hover:text-accent font-semibold text-gray-800 dark:group-hover:text-accent dark:text-neutral-200">
              {title}
            </h3>
         
          </div>
          <div>
            <svg
              className="shrink-0 size-5 text-gray-800 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};

interface JobCategoriesSectionProps {
  categories?: JobCategoryCardProps[];
}

const Pages: React.FC<JobCategoriesSectionProps> = ({
  categories = [
    { title: 'Hopme page', jobCount: 4 },
    { title: 'Booking Process', jobCount: 26 },
    { title: 'Receipt Verification', jobCount: 9 },
    { title: 'Trust System', jobCount: 11 },
    { title: 'About Us', jobCount: 37 },
    { title: 'Contact Us', jobCount: 2 },
    { title: 'Help Center', jobCount: 10 },
    { title: 'FAQ', jobCount: 14 },
    { title: 'Business Support', jobCount: 14 },
    { title: 'Pro Plan', jobCount: 14 },
    { title: 'Rewards Program', jobCount: 14 },
     
  ],
}) => {
  return (
    <div className=" px-2 py-10  lg:px-6 lg:py-14 mx-auto">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {categories.map((category, index) => (
          <JobCategoryCard
            key={index}
            title={category.title}
            jobCount={category.jobCount}
            href={category.href}
          />
        ))}
      </div>
    </div>
  );
};

export default Pages;
export default function LogoCloud() {
  const companies = [
    'Acme Corp',
    'Globex',
    'Soylent',
    'Initech',
    'Umbrella',
    'Hooli',
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 mb-8">
          TRUSTED BY 2,000+ COMPANIES WORLDWIDE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {companies.map((company) => (
            <div
              key={company}
              className="text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors cursor-default"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

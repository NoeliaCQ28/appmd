export const SkeletonAccordion = () => {
  return (
    <div className="space-y-3 w-full mx-auto">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gray-200 rounded-lg animate-pulse"
        >
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
          <div className="h-6 w-12 bg-gray-400 rounded"></div>
        </div>
      ))}
    </div>
  );
};

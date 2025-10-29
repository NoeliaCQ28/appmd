export const Divider = () => {
  return (
    <div className="my-6 flex items-center">
      <div className="flex-1 h-[4px] bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
      <div className="px-4">
        <div className="w-1.5 h-1.5 bg-stone-600 rounded-full"></div>
      </div>
      <div className="flex-1 h-[4px] bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
    </div>
  );
};

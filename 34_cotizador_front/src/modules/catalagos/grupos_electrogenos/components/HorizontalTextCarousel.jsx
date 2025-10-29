export const HorizontalTextCarousel = ({
  text,
  maxWidth = 420,
  duration = 24,
}) => {
  if (!text) return null;
  return (
    <div
      className="overflow-hidden relative"
      style={{ maxWidth: `${maxWidth}px`, width: "100%" }}
    >
      <div
        className="whitespace-nowrap animate-marquee"
        style={{
          display: "inline-block",
          animation: `marquee ${duration}s linear infinite`,
          minWidth: "100%",
          maxWidth: `${maxWidth}px`,
        }}
      >
        {text.replace(/\n/g, " ￿0 ")}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

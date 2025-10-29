import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ left: true, top: true });
  const containerRef = useRef(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      setPosition({
        left: rect.left > windowWidth / 2,
        top: rect.top > windowHeight / 2,
      });

      setTooltipPosition({
        x: position.left ? rect.right : rect.left,
        y: position.top ? rect.top : rect.bottom,
      });
    }
  }, [isVisible, position.left, position.top]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position.top ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position.top ? 5 : -5 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: position.top ? tooltipPosition.y - 10 : tooltipPosition.y + 10,
              transform: position.left ? 'translateX(-100%)' : 'translateX(0)',
            }}
            className={`z-50 px-3 py-2 text-sm text-gray-700 bg-white 
              rounded-lg shadow-lg border border-gray-100 
              max-w-md break-words`}
          >
            <div
              className={`absolute ${position.top ? "-bottom-1" : "-top-1"} ${
                position.left ? "right-4" : "left-4"
              } w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100`}
            ></div>
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AnimatedPlaceholderProps {
  placeholders: string[];
  className?: string;
}

export const AnimatedPlaceholder = ({ placeholders, className = '' }: AnimatedPlaceholderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [placeholders.length]);

  return (
    <div className={`relative w-full h-full flex items-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center text-gray-400 dark:text-gray-500 text-base"
        >
          <span className="truncate">{placeholders[currentIndex]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

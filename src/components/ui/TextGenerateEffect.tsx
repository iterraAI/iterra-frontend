import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "../../utils/cn";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const controls = useAnimation();
  const wordsArray = words.split(" ");

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      transition: { delay: i * 0.1 }, // Stagger effect
    }));
  }, [controls]);

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black leading-snug tracking-wide">
          {wordsArray.map((word, idx) => {
            return (
              <motion.span
                key={word + idx}
                custom={idx}
                initial={{ opacity: 0 }}
                animate={controls}
                className="dark:text-white text-black opacity-0"
              >
                {word}{" "}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

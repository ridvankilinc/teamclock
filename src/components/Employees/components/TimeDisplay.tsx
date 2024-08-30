import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cn from "classnames";

const TimeDisplay = memo(function TimeDisplay({
  time,
  timeDiff,
  isHovered,
  index,
}: {
  time: string | undefined;
  timeDiff: string;
  isHovered: boolean;
  index: number;
}) {
  return (
    <motion.div
      className="relative overflow-hidden h-6 min-w-20 flex justify-end items-center"
      layout
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute flex justify-end"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className={cn("text-gray-500 font-medium text-sm", {
                "!text-green-400": timeDiff.startsWith("+"),
                "!text-red-400": timeDiff.startsWith("-"),
              })}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {timeDiff}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            className="absolute flex justify-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="text-gray-500 font-medium text-sm">
              {time}
              {Number(time?.split(":")[0]) < 12 ? "AM" : "PM"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default TimeDisplay;

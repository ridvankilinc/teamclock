import { AnimatePresence, motion } from "framer-motion";

interface AnimatedPeriodProps {
  period: string;
  prevPeriod: string;
}

const AnimatedPeriod: React.FC<AnimatedPeriodProps> = ({
  period,
  prevPeriod,
}) => {
  return (
    <div className="flex items-center">
      <div className="relative w-3 h-4 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={period[0]}
            initial={{ y: prevPeriod[0] === "P" ? -40 : 40 }}
            animate={{ y: 0 }}
            exit={{ y: prevPeriod[0] === "P" ? 40 : -40 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {period[0]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-3 h-4 flex items-center justify-center text-xl font-mono text-gray-400">
        {period[1]}
      </div>
    </div>
  );
};

export default AnimatedPeriod;

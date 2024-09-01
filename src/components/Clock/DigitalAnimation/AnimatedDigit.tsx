import { AnimatePresence, motion } from "framer-motion";

interface AnimatedDigitProps {
  digit: number;
  prevDigit: number;
}

const AnimatedDigit = ({ digit, prevDigit }: AnimatedDigitProps) => {
  return (
    <div className="relative h-4 w-3 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={digit}
          initial={{ y: prevDigit > digit ? -40 : 40 }}
          animate={{ y: 0 }}
          exit={{ y: prevDigit > digit ? 40 : -40 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedDigit;

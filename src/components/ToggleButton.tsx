import { motion } from "framer-motion";
import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";

const ToggleButton = () => {
  const { isOpen, setIsOpen } = useTeamClock();

  return (
    <motion.div
      className={cn(
        "relative flex items-center bg-gray-100 w-10 h-6 rounded-full cursor-pointer",
        { "!bg-black": isOpen }
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.button
        className={cn("absolute size-5 bg-white rounded-full mx-0.5 shadow", {
          " translate-x-4": isOpen,
        })}
        animate={{ x: isOpen ? "80%" : 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default ToggleButton;

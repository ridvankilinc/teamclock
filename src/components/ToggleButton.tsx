import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";
import { AnimatePresence } from "framer-motion";

const ToggleButton = () => {
  const { isOpen, setIsOpen } = useTeamClock();

  return (
    <AnimatePresence>
      <div
        className={cn(
          "relative flex items-center w-10 h-6 rounded-full cursor-pointer transition-colors duration-500 ease-in-out",
          { "bg-black": isOpen, "bg-gray-100": !isOpen }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={cn(
            "absolute size-5 bg-white rounded-full mx-0.5 shadow transition-transform duration-500 ease-in-out",
            { "translate-x-4": isOpen }
          )}
        />
      </div>
    </AnimatePresence>
  );
};

export default ToggleButton;

import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";

const ToggleButton = () => {
  const { isOpen, setIsOpen } = useTeamClock();

  return (
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
  );
};

export default ToggleButton;

import { ClockRect, TeamClockContextProps } from "@/components/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";

const TeamClockContext = createContext<TeamClockContextProps | undefined>(
  undefined
);

export const TeamClockProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);
  const [employeeTimes, setEmployeeTimes] = useState<string[] | null>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clockRect, setClockRect] = useState<ClockRect | null>(null);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setAnimationComplete(false);
    }
  }, [isOpen]);

  return (
    <TeamClockContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedTimezone,
        setSelectedTimezone,
        employeeTimes,
        setEmployeeTimes,
        hoveredIndex,
        setHoveredIndex,
        clockRect,
        setClockRect,
        animationComplete,
        setAnimationComplete,
      }}
    >
      {children}
    </TeamClockContext.Provider>
  );
};

export const useTeamClock = (): TeamClockContextProps => {
  const context = useContext(TeamClockContext);
  if (context === undefined) {
    throw new Error("useTeamClock must be used within a TeamClockProvider");
  }
  return context;
};

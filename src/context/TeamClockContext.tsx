import { ClockRect, TeamClockContextProps } from "@/components/types";
import { createContext, PropsWithChildren, useContext, useState } from "react";

const TeamClockContext = createContext<TeamClockContextProps | undefined>(
  undefined
);

export const TeamClockProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);
  const [employeeTimes, setEmployeeTimes] = useState<string[] | null>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clockRect, setClockRect] = useState<ClockRect | null>(null);

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
      }}
    >
      {children}
    </TeamClockContext.Provider>
  );
};

export const useTeamClock = (): TeamClockContextProps => {
  const context = useContext(TeamClockContext);
  if (context === undefined) {
    throw new Error("error");
  }
  return context;
};

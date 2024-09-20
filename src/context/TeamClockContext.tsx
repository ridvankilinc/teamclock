import { Rect, TeamClockContextProps } from "@/components/types";
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
  const [containerRect, setContainerRect] = useState<Rect | null>(null);
  const [centerRect, setCenterRect] = useState<Rect | null>(null);
  const [clockRect, setClockRect] = useState<Rect | null>(null);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsInitialRender(false);
    }
  }, [isOpen]);

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

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        containerRect,
        setContainerRect,
        centerRect,
        setCenterRect,
        clockRect,
        setClockRect,
        animationComplete,
        setAnimationComplete,
        isInitialRender,
        setIsInitialRender,
        isSmallScreen,
        setIsSmallScreen,
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

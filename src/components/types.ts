export interface TeamClockContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTimezone: string | null;
  setSelectedTimezone: React.Dispatch<React.SetStateAction<string | null>>;
  employeeTimes: string[] | null;
  setEmployeeTimes: React.Dispatch<React.SetStateAction<string[] | null>>;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
  containerRect: Rect | null;
  setContainerRect: React.Dispatch<React.SetStateAction<Rect | null>>;
  centerRect: Rect | null;
  setCenterRect: React.Dispatch<React.SetStateAction<Rect | null>>;
  clockRect: Rect | null;
  setClockRect: React.Dispatch<React.SetStateAction<Rect | null>>;
  animationComplete: boolean;
  setAnimationComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isInitialRender: boolean;
  setIsInitialRender: React.Dispatch<React.SetStateAction<boolean>>;
  isSmallScreen: boolean | null;
  setIsSmallScreen: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export interface EmployeeProps {
  id?: string;
  avatar: string;
  name: string;
  region: string;
  time?: string;
}

export interface Rect {
  width: number;
  height: number;
  left: number;
  top: number;
}

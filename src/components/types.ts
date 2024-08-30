export interface TeamClockContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTimezone: string | null;
  setSelectedTimezone: React.Dispatch<React.SetStateAction<string | null>>;
  employeeTimes: string[] | null;
  setEmployeeTimes: React.Dispatch<React.SetStateAction<string[] | null>>;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
  clockRect: ClockRect | null;
  setClockRect: React.Dispatch<React.SetStateAction<ClockRect | null>>;
}

export interface EmployeeProps {
  avatar: string;
  name: string;
  region: string;
  time?: string;
}

export interface ClockRect {
  width: number;
  height: number;
  left: number;
  top: number;
}

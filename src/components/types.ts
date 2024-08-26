export interface TeamClockContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTimezone: string | null;
  setSelectedTimezone: React.Dispatch<React.SetStateAction<string | null>>;
  employeeTimes: string[] | null;
  setEmployeeTimes: React.Dispatch<React.SetStateAction<string[] | null>>;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface EmployeeProps {
  avatar: string;
  name: string;
  region: string;
  time?: string;
}

import { useCallback, useEffect, useState, useRef } from "react";
import { EmployeeProps } from "../types";
import { getTimeZones } from "@vvo/tzdb";
import Card from "./components/Card";
import { DateTime } from "luxon";
import { useTeamClock } from "@/context/TeamClockContext";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";

const Employees = ({ employees }: { employees: EmployeeProps[] }) => {
  const [times, setTimes] = useState<string[]>([]);
  const [timezones, setTimezones] = useState<string[]>([]);
  const [visibleCards, setVisibleCards] = useState<EmployeeProps[]>([]);
  const [employeeTimezones, setEmployeeTimezones] = useState<string[]>([]);
  const [sameTimeEmployees, setSameTimeEmployees] = useState<number[]>([]);
  const [_, setSameTimeEmployeesNames] = useState<EmployeeProps[][]>([]);
  const {
    setEmployeeTimes,
    hoveredIndex,
    setHoveredIndex,
    isOpen,
    animationComplete,
    isInitialRender,
  } = useTeamClock();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const countSameTimeEmployees = () => {
      const counts = times.map((time, index) => {
        return times.filter((t, i) => {
          const currentHour = parseInt(time.split(":")[0]);
          const tHour = parseInt(t.split(":")[0]);
          const currentMinute = time.split(":")[1];
          const tMinute = t.split(":")[1];

          return (
            currentHour % 12 === tHour % 12 &&
            currentMinute === tMinute &&
            i <= index
          );
        }).length;
      });
      setSameTimeEmployees(counts);
    };

    countSameTimeEmployees();
  }, [times]);

  const findTimezone = useCallback((city: string, country: string): string => {
    try {
      const allTimeZones = getTimeZones();
      const lowerCity = city.toLowerCase();
      const lowerCountry = country.toLowerCase();

      const cityMatch = allTimeZones.find((tz) =>
        tz.mainCities.some((c) => c.toLowerCase() === lowerCity)
      );

      if (cityMatch) return cityMatch.name;

      const countryMatch = allTimeZones.find((tz) =>
        tz.countryName.toLowerCase().includes(lowerCountry)
      );

      if (countryMatch) return countryMatch.name;

      const closestMatch = allTimeZones.reduce(
        (closest, tz) => {
          const cityScore = tz.mainCities.some(
            (c) =>
              lowerCity.includes(c.toLowerCase()) ||
              c.toLowerCase().includes(lowerCity)
          )
            ? 1
            : 0;
          const countryScore = tz.countryName
            .toLowerCase()
            .includes(lowerCountry)
            ? 1
            : 0;
          const score = cityScore + countryScore;
          return score > closest.score ? { name: tz.name, score } : closest;
        },
        { name: "UTC", score: -1 }
      );

      return closestMatch.name;
    } catch (error) {
      return "UTC";
    }
  }, []);

  useEffect(() => {
    const timezones = employees.map((employee: EmployeeProps) => {
      const [city, country] = employee.region.split(",").map((s) => s.trim());
      return findTimezone(city, country);
    });
    setEmployeeTimezones(timezones);
  }, [employees, findTimezone]);

  const updateTimes = useCallback(() => {
    const newTimes = employeeTimezones.map((timezone) => {
      const currentTime = DateTime.now().setZone(timezone);
      return currentTime.toFormat("HH:mm");
    });
    setTimes(newTimes);
    setEmployeeTimes(newTimes);
  }, [employeeTimezones, setEmployeeTimes]);

  useEffect(() => {
    const scheduleNextUpdate = () => {
      const now = new Date();
      const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
      return setTimeout(() => {
        updateTimes();
        scheduleNextUpdate();
      }, delay);
    };

    updateTimes();
    const timeoutId = scheduleNextUpdate();

    return () => clearTimeout(timeoutId);
  }, [updateTimes]);

  const getTimeDifference = useCallback(
    (index: number): string => {
      const localTime = DateTime.now();

      const employeeTimezone = employeeTimezones[index] || "UTC";
      const employeeTime = DateTime.now().setZone(employeeTimezone);

      const diffMinutes = employeeTime.offset - localTime.offset;
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = Math.abs(diffMinutes % 60);

      if (diffHours === 0 && remainingMinutes === 0) return "No change";

      let diffString = "";
      if (diffHours !== 0) {
        diffString += `${Math.abs(diffHours)} hour${
          Math.abs(diffHours) !== 1 ? "s" : ""
        }`;
      }
      if (remainingMinutes !== 0) {
        if (diffString !== "") diffString += " ";
        diffString += `${remainingMinutes} minute${
          remainingMinutes !== 1 ? "s" : ""
        }`;
      }

      return `${diffHours >= 0 ? "+" : "-"}${diffString}`;
    },
    [employeeTimezones]
  );

  useEffect(() => {
    const groupSameTimeEmployees = () => {
      const groups: { [key: string]: EmployeeProps[] } = {};
      times.forEach((time, index) => {
        if (!groups[time]) {
          groups[time] = [];
        }
        groups[time].push(employees[index]);
      });
      setSameTimeEmployeesNames(Object.values(groups));
    };

    groupSameTimeEmployees();
  }, [times, employees]);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className={cn(
          "flex flex-col gap-1 overflow-x-hidden max-h-96 custom-scrollbar pr-2",
          {
            relative: isInitialRender || (!isOpen && animationComplete),
          }
        )}
      >
        {employees.map((item: EmployeeProps, i: number) => (
          <Card
            {...item}
            time={times[i]}
            id={i.toString()}
            timeDiff={getTimeDifference(i)}
            isHovered={hoveredIndex === i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            key={i}
            index={i}
            sameTimeCount={sameTimeEmployees[i]}
            isLastWithSameTime={
              i === employees.length - 1 ||
              times[i] !== times[i + 1] ||
              sameTimeEmployees[i] !== sameTimeEmployees[i + 1]
            }
            sameTimeEmployees={employees.map((emp, index) => ({
              ...emp,
              time: times[index],
            }))}
            visibleCards={visibleCards}
            setVisibleCards={setVisibleCards}
            containerRef={containerRef}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default Employees;

import { useCallback, useEffect, useMemo, useState } from "react";
import { EmployeeProps } from "../types";
import { getTimeZones } from "@vvo/tzdb";
import Card from "./components/Card";
import moment from "moment-timezone";
import { useTeamClock } from "@/context/TeamClockContext";

const Employees = ({ employees }: { employees: EmployeeProps[] }) => {
  const [times, setTimes] = useState<string[]>([]);
  const [timezones, setTimezones] = useState<string[]>([]);
  const [sameTimeEmployees, setSameTimeEmployees] = useState<number[]>([]);
  const { setEmployeeTimes, hoveredIndex, setHoveredIndex, isOpen } =
    useTeamClock();

  useEffect(() => {
    const countSameTimeEmployees = () => {
      const counts = times.map((time, index) => {
        return times.filter((t, i) => t === time && i <= index).length;
      });
      setSameTimeEmployees(counts);
    };

    countSameTimeEmployees();
  }, [times]);

  const findTimezone = useCallback((city: string, country: string): string => {
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

    return allTimeZones.reduce(
      (closest, tz) => {
        const cityScore = tz.mainCities.some(
          (c) =>
            lowerCity.includes(c.toLowerCase()) ||
            c.toLowerCase().includes(lowerCity)
        )
          ? 1
          : 0;
        const countryScore = tz.countryName.toLowerCase().includes(lowerCountry)
          ? 1
          : 0;
        const score = cityScore + countryScore;
        return score > closest.score ? { name: tz.name, score } : closest;
      },
      { name: "UTC", score: -1 }
    ).name;
  }, []);

  const updateTimes = useCallback(() => {
    const newTimes = employees.map((employee: EmployeeProps) => {
      const [city, country] = employee.region.split(",").map((s) => s.trim());
      const timezone = findTimezone(city, country);
      const currentTime = moment().tz(timezone);
      return currentTime.format("HH:mm");
    });
    setTimes(newTimes);

    const clockTimes = employees.map((employee: EmployeeProps) => {
      const [city, country] = employee.region.split(",").map((s) => s.trim());
      const timezone = findTimezone(city, country);
      const currentTime = moment().tz(timezone);
      return currentTime.format("HH:mm");
    });
    setEmployeeTimes(clockTimes);

    const newTimezones = employees.map((employee: EmployeeProps) => {
      const [city, country] = employee.region.split(",").map((s) => s.trim());
      return findTimezone(city, country);
    });
    setTimezones(newTimezones);
  }, [employees, findTimezone, setEmployeeTimes]);

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
      const localTime = moment();
      const employeeTimezone = timezones[index] || "UTC";
      const employeeTime = moment().tz(employeeTimezone);

      const diffMinutes = employeeTime.utcOffset() - localTime.utcOffset();
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
    [timezones]
  );

  return (
    <div className="flex flex-col gap-2 max-h-80 ">
      {employees.map((item: EmployeeProps, i: number) => (
        <Card
          avatar={item.avatar}
          name={item.name}
          region={item.region}
          time={times[i]}
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
        />
      ))}
    </div>
  );
};

export default Employees;

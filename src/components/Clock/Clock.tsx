import { useTeamClock } from "@/context/TeamClockContext";
import cn from "classnames";
import moment from "moment-timezone";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Digital from "./Digital";

const Clock = memo(function Clock() {
  const {
    isOpen,
    selectedTimezone,
    employeeTimes,
    hoveredIndex,
    setClockRect,
  } = useTeamClock();
  const [time, setTime] = useState<Date>(new Date());
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentTime = selectedTimezone
    ? moment(time).tz(selectedTimezone)
    : moment(time);
  const seconds = currentTime.seconds();
  const minutes = currentTime.minutes();
  const hours = currentTime.hours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = (((hours % 12) + minutes / 60) / 12) * 360;

  const timeToAngle = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return (((hours % 12) + minutes / 60) / 12) * 360;
  };

  const uniqueEmployeeTimes = Array.from(new Set(employeeTimes));

  const isCurrentTimeEqualToEmployeeTime = (employeeTime: any) => {
    const [employeeHours, employeeMinutes] = employeeTime
      .split(":")
      .map(Number);
    return employeeHours === hours && employeeMinutes === minutes;
  };

  const hoveredTime =
    hoveredIndex !== null && employeeTimes ? employeeTimes[hoveredIndex] : null;
  const hoveredAngle = hoveredTime ? timeToAngle(hoveredTime) : null;

  const findMostDistantTimes = (times: string[]): [string, string] => {
    let maxDifference = 0;
    let mostDistantPair: [string, string] = [times[0], times[1]];

    for (let i = 0; i < times.length; i++) {
      for (let j = i + 1; j < times.length; j++) {
        const angle1 = timeToAngle(times[i]);
        const angle2 = timeToAngle(times[j]);
        let difference = Math.abs(angle1 - angle2);
        if (difference > 180) difference = 360 - difference;

        if (difference > maxDifference) {
          maxDifference = difference;
          mostDistantPair = [times[i], times[j]];
        }
      }
    }

    return mostDistantPair;
  };

  const getEmployeeGradient = () => {
    if (!isOpen || !employeeTimes) return "none";

    const allTimes = [...uniqueEmployeeTimes, `${hours}:${minutes}`];

    if (allTimes.length < 2) return "none";

    const [time1, time2] = findMostDistantTimes(allTimes);

    if (!time1 || !time2) return "none";

    let angle1 = timeToAngle(time1);
    let angle2 = timeToAngle(time2);

    if (angle2 < angle1) {
      [angle1, angle2] = [angle2, angle1];
    }

    if (angle2 - angle1 > 180) {
      [angle1, angle2] = [angle2, angle1 + 360];
    }

    return `conic-gradient(from ${angle1}deg, 
    transparent 0deg,
    rgba(180, 180, 180, 0.3) ${angle2 - angle1}deg, 
    rgba(180, 180, 180, 0.3) ${angle2 - angle1}deg, 
    transparent ${angle2 - angle1}deg 360deg)`;
  };

  const getConicGradient = () => {
    if (hoveredAngle === null) return "none";
    let startAngle = hourDegrees % 360;
    let endAngle = hoveredAngle % 360;

    if (endAngle < startAngle) {
      endAngle += 360;
    }

    return `conic-gradient(from ${startAngle}deg, 
      transparent 0deg,
      rgba(180, 180, 180, 0.15)  ${(endAngle - startAngle) / 2}deg, 
      rgba(180, 180, 180, 0.3)  ${endAngle - startAngle}deg, 
      transparent ${endAngle - startAngle}deg 360deg)`;
  };

  useEffect(() => {
    const updateClockRect = () => {
      if (clockRef.current) {
        const rect = clockRef.current.getBoundingClientRect();
        setClockRect({
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
        });
      }
    };

    updateClockRect();
    window.addEventListener("resize", updateClockRect);
    return () => window.removeEventListener("resize", updateClockRect);
  }, [setClockRect]);

  return (
    <div
      ref={clockRef}
      className="relative flex items-center justify-center size-64 rounded-full mx-auto"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isOpen ? getEmployeeGradient() : getConicGradient(),
        }}
      ></div>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={cn("absolute top-0 w-1 h-6 pt-4 bg-gray-400 rounded", {
            " !bg-gray-500": i % 3 === 0,
          })}
          style={{
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: "0 8rem",
          }}
        ></div>
      ))}
      {hoveredIndex !== null && employeeTimes && employeeTimes[hoveredIndex] ? (
        <div
          className={cn(
            "absolute z-20 w-1.5 h-24 rounded bg-black origin-center transition-transform duration-300",
            { "!h-16": isOpen }
          )}
          style={{
            transform: `rotate(${hoveredAngle}deg) translateY(${"-24%"})`,
          }}
        ></div>
      ) : (
        <div
          className={cn(
            "absolute z-20 w-1.5 h-24 rounded bg-black origin-center transition-transform duration-300",
            { "!h-16": isOpen }
          )}
          style={{
            transform: `rotate(${hourDegrees}deg) translateY(${
              isOpen ? "-50%" : "-24%"
            })`,
          }}
        />
      )}
      {isOpen &&
        employeeTimes &&
        uniqueEmployeeTimes.map((time, index) => {
          if (isCurrentTimeEqualToEmployeeTime(time)) {
            return null;
          }
          return (
            <div
              key={index}
              className="absolute z-20 w-1.5 h-16 origin-center bg-gray-400 rounded"
              style={{
                transform: `rotate(${timeToAngle(time)}deg) translateY(-50%)`,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          );
        })}

      <div
        className="absolute z-10 w-1.5 h-36 rounded bg-gray-600 origin-center transition-transform duration-300"
        style={{
          transform: `rotate(${minuteDegrees}deg) translateY(-30%)`,
        }}
      />

      <div
        className="absolute z-30 w-0.5 h-36 rounded bg-red-400 origin-center"
        style={{
          transform: `rotate(${secondDegrees}deg) translateY(-30%)`,
        }}
      />

      <div className="absolute z-30 size-1.5 bg-red-400 rounded-full origin-center" />

      {!isOpen && <Digital time={time} />}
    </div>
  );
});
export default Clock;

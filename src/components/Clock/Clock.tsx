import { useTeamClock } from "@/context/TeamClockContext";
import cn from "classnames";
import { DateTime } from "luxon";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    const timer = setInterval(() => (setTime(new Date()), 1000));

    return () => clearInterval(timer);
  }, []);

  const currentTime = selectedTimezone
    ? DateTime.now().setZone(selectedTimezone)
    : DateTime.now();
  const { seconds, minutes, hours } = useMemo(
    () => ({
      seconds: currentTime.second,
      minutes: currentTime.minute,
      hours: currentTime.hour,
    }),
    [currentTime]
  );

  const { secondDegrees, minuteDegrees, hourDegrees } = useMemo(
    () => ({
      secondDegrees: (seconds / 60) * 360,
      minuteDegrees: ((minutes * 60 + seconds) / 3600) * 360,
      hourDegrees: (hours > 12 ? hours % 12 : hours) * 30 + minutes * 0.5,
    }),
    [seconds, minutes, hours]
  );

  const timeToAngle = useCallback((timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return (hours > 12 ? hours % 12 : hours) * 30 + minutes * 0.5;
  }, []);

  const uniqueEmployeeTimes = useMemo(
    () => Array.from(new Set(employeeTimes)),
    [employeeTimes]
  );

  const isCurrentTimeEqualToEmployeeTime = useCallback(
    (employeeTime: string) => {
      const [employeeHours, employeeMinutes] = employeeTime
        .split(":")
        .map(Number);
      return employeeHours === hours && employeeMinutes === minutes;
    },
    [hours, minutes]
  );

  const hoveredTime = useMemo(
    () =>
      hoveredIndex !== null && employeeTimes
        ? employeeTimes[hoveredIndex]
        : null,
    [hoveredIndex, employeeTimes]
  );

  const findMostDistantTimes = useCallback(
    (times: string[]): [string, string] => {
      let maxDifference = 0;
      let mostDistantPair: [string, string] = [times[0], times[1]];

      for (let i = 0; i < times.length; i++) {
        for (let j = i + 1; j < times.length; j++) {
          const angle1 = timeToAngle(times[i]);
          const angle2 = timeToAngle(times[j]);

          let difference = Math.abs(angle1 - angle2);
          difference = Math.min(difference, 360 - difference);

          const [h1, m1] = times[i].split(":").map(Number);
          const [h2, m2] = times[j].split(":").map(Number);
          const timeDiff = Math.abs(h1 * 60 + m1 - (h2 * 60 + m2));

          if (timeDiff > maxDifference) {
            maxDifference = timeDiff;
            mostDistantPair = [times[i], times[j]];
          }
        }
      }

      return mostDistantPair;
    },
    [timeToAngle]
  );

  const getTimeDifference = useCallback((time1: string, time2: string) => {
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);

    let diff = h2 * 60 + m2 - (h1 * 60 + m1);
    if (diff > 12 * 60) diff -= 24 * 60;
    if (diff < -12 * 60) diff += 24 * 60;

    return diff / 60;
  }, []);

  const getHourHandRotation = useCallback(() => {
    if (hoveredTime) {
      const currentTimeString = `${hours}:${minutes}`;
      const timeDiff = getTimeDifference(currentTimeString, hoveredTime);
      const newHourDegrees = hourDegrees + timeDiff * 30;
      return newHourDegrees;
    }
    return hourDegrees;
  }, [hoveredTime, hours, minutes, hourDegrees, getTimeDifference]);

  const getEmployeeGradient = useCallback(() => {
    if (!isOpen || !employeeTimes) return "none";

    const allTimes = [...uniqueEmployeeTimes, `${hours}:${minutes}`];

    if (allTimes.length < 2) return "none";

    const [time1, time2] = findMostDistantTimes(allTimes);

    if (!time1 || !time2) return "none";

    let angle1 = timeToAngle(time1);
    let angle2 = timeToAngle(time2);

    const largeAngle =
      Math.abs(angle2 - angle1) > 180
        ? Math.abs(angle2 - angle1)
        : 360 - Math.abs(angle2 - angle1);

    const startAngle = angle1 < angle2 ? angle2 : angle1;

    return `conic-gradient(from ${startAngle}deg, 
    rgba(180, 180, 180, 0.2) 0deg, 
    rgba(180, 180, 180, 0.2) ${largeAngle}deg, 
    transparent ${largeAngle}deg 360deg)`;
  }, [
    isOpen,
    employeeTimes,
    uniqueEmployeeTimes,
    hours,
    minutes,
    findMostDistantTimes,
    timeToAngle,
  ]);

  const getConicGradient = useCallback(() => {
    if (hoveredTime === null) return "none";

    const currentTimeString = `${hours}:${minutes}`;
    const timeDiff = getTimeDifference(currentTimeString, hoveredTime);

    let startAngle = (hours > 12 ? hours % 12 : hours) * 30 + minutes * 0.5;
    let sweepAngle = timeDiff * 30;

    startAngle = (startAngle + 360) % 360;

    if (sweepAngle < 0) {
      startAngle = (startAngle + sweepAngle + 360) % 360;
      sweepAngle = Math.abs(sweepAngle);
    }

    return `conic-gradient(from ${startAngle}deg, 
      rgba(180, 180, 180, 0.1) 0deg ${sweepAngle}deg, 
      transparent ${sweepAngle}deg 360deg)`;
  }, [hoveredTime, hours, minutes, getTimeDifference]);

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
            transformOrigin: "50% 8rem",
          }}
        ></div>
      ))}
      {hoveredIndex !== null && employeeTimes && employeeTimes[hoveredIndex] ? (
        <div
          className={cn(
            "absolute z-20 w-1.5 h-24 rounded bg-black origin-center transition-transform duration-500",
            { "!h-16": isOpen }
          )}
          style={{
            transform: `rotate(${getHourHandRotation()}deg) translateY(${"-20%"})`,
          }}
        ></div>
      ) : (
        <div
          className={cn(
            "absolute z-20 w-1.5 h-24 rounded bg-black origin-center transition-transform duration-500",
            { "!h-16": isOpen }
          )}
          style={{
            transform: `rotate(${hourDegrees}deg) translateY(${
              isOpen ? "-50%" : "-20%"
            })`,
            transition: "0.4s ease-in-out",
          }}
        />
      )}
      {uniqueEmployeeTimes.map((time, index) => {
        if (isCurrentTimeEqualToEmployeeTime(time)) {
          return null;
        }
        return (
          <motion.div
            key={index}
            className="absolute z-20 w-1.5 h-16 origin-center bg-gray-400 rounded"
            initial={{
              transform: `rotate(${hourDegrees}deg) translateY(-50%)`,
            }}
            animate={{
              transform: isOpen
                ? `rotate(${timeToAngle(time)}deg) translateY(-50%)`
                : `rotate(${hourDegrees}deg) translateY(-50%)`,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        );
      })}

      <div
        className="absolute z-10 w-1.5 h-36 rounded bg-gray-600 origin-center transition-transform duration-300"
        style={{
          transform: `rotate(${minuteDegrees % 360}deg) translateY(-30%)`,
        }}
      />

      <div
        className="absolute z-30 w-0.5 h-36 rounded bg-red-400 origin-center"
        style={{
          transform: `rotate(${secondDegrees}deg) translateY(-30%)`,
        }}
      />

      <div className="absolute z-30 size-1.5 bg-red-400 rounded-full origin-center" />

      <Digital time={time} />
    </div>
  );
});
export default Clock;

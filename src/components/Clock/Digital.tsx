import { useTeamClock } from "@/context/TeamClockContext";
import { useCallback } from "react";

const Digital = ({ time }: any) => {
  const { hoveredIndex, employeeTimes } = useTeamClock();

  const formatTime = useCallback(
    (value: number) => value.toString().padStart(2, "0"),
    []
  );

  return (
    <div className="absolute bottom-12 text-xl font-mono text-gray-400">
      {hoveredIndex !== null && employeeTimes && employeeTimes[hoveredIndex] ? (
        <div>
          {employeeTimes[hoveredIndex]}
          {parseInt(employeeTimes[hoveredIndex].split(":")[0]) >= 12
            ? "PM"
            : "AM"}
        </div>
      ) : (
        <>
          {formatTime(time.getHours())}:{formatTime(time.getMinutes())}
          {time.getHours() >= 12 ? "PM" : "AM"}
        </>
      )}
    </div>
  );
};

export default Digital;

/* eslint-disable @next/next/no-img-element */
import { EmployeeProps } from "@/components/types";
import { useEffect, useMemo, useState } from "react";
import TimeDisplay from "./TimeDisplay";
import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";
import { motion } from "framer-motion";

const Card = ({
  name,
  avatar,
  region,
  time,
  timeDiff,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  index,
}: EmployeeProps & {
  time: any;
  timeDiff: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  index: number;
}) => {
  const { isOpen, clockRect, employeeTimes } = useTeamClock();
  const [sameRadiusWidth, setSameRadiusWidth] = useState(0);

  useEffect(() => {
    if (isOpen && clockRect) {
      const sameTimeEmployees = employeeTimes
        ?.slice(0, index)
        .filter((t) => t === time).length;

      sameTimeEmployees &&
        sameTimeEmployees < 2 &&
        setSameRadiusWidth(sameTimeEmployees * 10);
    }
  }, [isOpen, clockRect, employeeTimes, time, index]);

  const renderImage = useMemo(() => {
    if (time && isOpen && clockRect) {
      const timeParts = time.split(":");
      const hours = parseInt(timeParts[0]) % 12;
      const minutes = parseInt(timeParts[1]);

      const angle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
      const radius = clockRect.width / 2 - 20 - sameRadiusWidth;

      const clockCenterX = clockRect.left + clockRect.width;
      const clockCenterY = clockRect.top + clockRect.height / 2;

      const y = clockCenterY + radius * Math.sin(angle);
      const x = clockCenterX + radius * Math.cos(angle);

      console.log("time", employeeTimes);

      return (
        <motion.img
          src={avatar}
          alt={`${name} avatar's`}
          className={cn("size-10 rounded-full absolute")}
          animate={{
            top: y - 21,
            left: x + 24,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      );
    }

    return (
      <img
        src={avatar}
        alt={`${name} avatar's`}
        className={cn("size-10 rounded-full")}
      />
    );
  }, [avatar, isOpen, name, time, clockRect, employeeTimes, sameRadiusWidth]);

  return (
    <motion.div
      className="flex justify-between p-2 rounded-2xl cursor-default hover:bg-gray-200 transition-colors duration-500 ease-in-out"
      onMouseEnter={isOpen ? undefined : onMouseEnter}
      onMouseLeave={isOpen ? undefined : onMouseLeave}
      animate={{
        top: "auto",
        left: "auto",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex gap-2 items-center">
        {renderImage}
        <div className="flex flex-col">
          <h4 className="text-lg font-bold">{name}</h4>
          <p className="text-gray-600">{region}</p>
        </div>
      </div>
      <TimeDisplay
        index={index}
        time={time}
        timeDiff={timeDiff}
        isHovered={isHovered}
      />
    </motion.div>
  );
};

export default Card;

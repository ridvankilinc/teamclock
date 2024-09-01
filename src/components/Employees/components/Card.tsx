/* eslint-disable @next/next/no-img-element */
import { EmployeeProps } from "@/components/types";
import { useEffect, useMemo, useState } from "react";
import TimeDisplay from "./TimeDisplay";
import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";
import { motion } from "framer-motion";

interface animateProps {
  top?: string | number;
  left?: string | number;
  opacity?: number;
}

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

  const renderDivContent = useMemo(() => {
    let animateImg: animateProps = { top: "auto", left: "auto" };
    let animateContent: animateProps = {
      top: "auto",
      left: "auto",
      opacity: 1,
    };

    if (clockRect) {
      if (isOpen) {
        const timeParts = time.split(":");
        const hours = parseInt(timeParts[0]) % 12;
        const minutes = parseInt(timeParts[1]);

        const angle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
        const radius = clockRect.width / 2 - 20 - sameRadiusWidth;

        const clockCenterX = clockRect.left + clockRect.width;
        const clockCenterY = clockRect.top + clockRect.height / 2;

        const y = clockCenterY + radius * Math.sin(angle);
        const x = clockCenterX + radius * Math.cos(angle);

        animateImg = {
          top: y - 34,
          left: x + 17,
        };

        animateContent = {
          top: y - 34,
          left: x + 17,
          opacity: 0,
        };
      } else {
        animateImg = { top: "auto", left: "auto" };
        animateContent = { top: "auto", left: "auto", opacity: 1 };
      }
    }

    return (
      <motion.div
        className={cn(" flex justify-between p-2  min-h-16 min-w-72", {
          absolute: isOpen,
        })}
        onMouseEnter={isOpen ? undefined : onMouseEnter}
        onMouseLeave={isOpen ? undefined : onMouseLeave}
        animate={animateImg}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className={cn("flex gap-2 items-center")}>
          <img
            src={avatar}
            alt={`${name} avatar's`}
            className={cn("size-10 rounded-full")}
          />
          <motion.div
            className={cn("flex flex-col")}
            animate={animateContent}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h4 className="text-lg font-bold">{name}</h4>
            <p className="text-gray-600">{region}</p>
          </motion.div>
        </div>
        <motion.div
          animate={animateContent}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <TimeDisplay time={time} timeDiff={timeDiff} isHovered={isHovered} />
        </motion.div>
      </motion.div>
    );
  }, [
    clockRect,
    isOpen,
    onMouseEnter,
    onMouseLeave,
    avatar,
    name,
    region,
    time,
    timeDiff,
    isHovered,
    sameRadiusWidth,
  ]);

  return (
    <div
      className={cn(
        "cursor-default flex items-center p-2 rounded-2xl min-h-16 min-w-72",
        {
          "hover:bg-gray-100 border border-transparent hover:border-gray-200":
            !isOpen,
        }
      )}
    >
      {renderDivContent}
    </div>
  );
};

export default Card;

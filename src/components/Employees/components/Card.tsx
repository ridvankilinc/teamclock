/* eslint-disable @next/next/no-img-element */
import { EmployeeProps } from "@/components/types";
import { useEffect, useMemo, useRef, useState } from "react";
import TimeDisplay from "./TimeDisplay";
import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";
import { AnimatePresence, motion } from "framer-motion";

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
  sameTimeCount,
  isLastWithSameTime,
}: EmployeeProps & {
  time: any;
  timeDiff: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  index: number;
  sameTimeCount: number;
  isLastWithSameTime: boolean;
}) => {
  const { isOpen, clockRect, employeeTimes } = useTeamClock();
  const [sameRadiusWidth, setSameRadiusWidth] = useState(0);
  const [sameTimeEmployeesCount, setSameTimeEmployeesCount] =
    useState<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [initialX, setInitialX] = useState<number>(0);
  const [initialY, setInitialY] = useState<number>(0);

  let divAnimate = { top: 0, left: 0 };

  useEffect(() => {
    if (isOpen && clockRect) {
      const sameTimeEmployees = employeeTimes
        ?.slice(0, index)
        .filter((t) => t === time).length;
      if (sameTimeEmployees) {
        setSameTimeEmployeesCount(sameTimeEmployees);
        sameTimeEmployees < 3
          ? setSameRadiusWidth(sameTimeEmployees * 10)
          : setSameRadiusWidth(20);
      }
    }
  }, [isOpen, clockRect, employeeTimes, time, index]);

  useEffect(() => {
    if (cardRef.current) {
      setInitialX(cardRef.current.getBoundingClientRect().left);
      setInitialY(cardRef.current.getBoundingClientRect().top);
    }
  }, []);

  const renderDivContent = useMemo(() => {
    let animateContent: animateProps = { top: "auto", left: "auto" };

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

        animateContent = {
          top: y - 34,
          left: x + 12,
        };

        divAnimate.top = y - 20;
        divAnimate.left = x + 20;
      } else {
        animateContent = { top: initialY, left: initialX };
      }
    }

    return (
      <AnimatePresence initial={false}>
        <motion.div
          className={cn("absolute flex justify-between p-2 min-w-72", {})}
          onMouseEnter={isOpen ? undefined : onMouseEnter}
          onMouseLeave={isOpen ? undefined : onMouseLeave}
          initial={{ top: initialY, left: initialX }}
          animate={animateContent}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          layout
        >
          <div className={cn("flex gap-2 items-center")}>
            <motion.img
              src={avatar}
              alt={`${name} avatar's`}
              className={cn("size-10 rounded-full")}
              animate={{
                opacity: sameTimeEmployeesCount > 2 && isOpen ? 0 : 1,
              }}
            />
            <motion.div
              className={cn("flex flex-col")}
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h4 className="text-lg font-bold">{name}</h4>
              <p className="text-gray-500 ">{region}</p>
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <TimeDisplay
              time={time}
              timeDiff={timeDiff}
              isHovered={isHovered}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }, [
    clockRect,
    sameTimeEmployeesCount,
    isOpen,
    onMouseEnter,
    onMouseLeave,
    initialY,
    initialX,
    avatar,
    name,
    region,
    time,
    timeDiff,
    isHovered,
    sameRadiusWidth,
    divAnimate,
  ]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "cursor-default flex items-center rounded-2xl min-h-16 min-w-72",
        {
          "hover:bg-gray-100 border border-transparent hover:border-gray-200":
            !isOpen,
        }
      )}
    >
      {renderDivContent}
      {isOpen && sameTimeEmployeesCount > 2 && isLastWithSameTime && (
        <motion.div
          className="size-10 rounded-full bg-gray-100  flex justify-center items-center absolute hover:bg-gray-200 z-10"
          style={{ top: divAnimate.top, left: divAnimate.left, opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          +{sameTimeCount - 2}
        </motion.div>
      )}
    </div>
  );
};

export default Card;

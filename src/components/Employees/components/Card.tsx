import { EmployeeProps } from "@/components/types";
import { memo, useEffect, useMemo, useState } from "react";
import TimeDisplay from "./TimeDisplay";
import { motion } from "framer-motion";
import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";

const Card = ({
  name,
  avatar,
  region,
  time,
  timeDiff,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: EmployeeProps & {
  time: any;
  timeDiff: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen } = useTeamClock();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getClockElement = useMemo(() => {
    if (time) {
      const timeParts = time?.split(":");
      const hours = parseInt(timeParts[0] || 1) % 12;
      const minutes = Math.floor(parseInt(timeParts[1]) / 10);
      const tempTime = hours * 6 + minutes;

      const clock = document.getElementById(`clock-${tempTime}`) as any;

      const clockRect = clock.getBoundingClientRect();
      const clockTop = clockRect.top;
      const clockLeft = clockRect.left;

      console.log(clockTop, clockLeft);

      return { clockRect, clockTop, clockLeft };
    }
    return null;
  }, [isOpen, isClient]);
  const RenderImage = () => {
    if (!isClient) return null;

    if (time) {
      const t = getClockElement;
      return (
        <motion.img
          src={avatar}
          alt={`${name} avatar's`}
          className={cn("size-10 rounded-full static", {
            "absolute visible": isOpen,
          })}
          animate={{
            top: isOpen ? t?.clockTop : "auto",
            left: isOpen ? t?.clockLeft : "auto",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          layout
        />
      );
    }

    return (
      <motion.img
        src={avatar}
        alt={`${name} avatar's`}
        className={cn("size-10 rounded-full")}
      />
    );
  };

  return (
    <motion.div
      className="flex justify-between p-2 rounded-2xl cursor-default"
      onMouseEnter={isOpen ? undefined : onMouseEnter}
      onMouseLeave={isOpen ? undefined : onMouseLeave}
      whileHover={{ backgroundColor: "#E5E7EB" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      layout
    >
      <motion.div className="flex gap-2 items-center">
        <RenderImage />
        <div className="flex flex-col">
          <h4 className="text-lg font-bold">{name}</h4>
          <p className="text-gray-600">{region}</p>
        </div>
      </motion.div>
      <TimeDisplay time={time} timeDiff={timeDiff} isHovered={isHovered} />
    </motion.div>
  );
};

export default Card;

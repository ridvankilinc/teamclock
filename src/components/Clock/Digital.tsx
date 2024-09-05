import { useTeamClock } from "@/context/TeamClockContext";
import { useEffect, useState } from "react";
import AnimatedDigit from "./DigitalAnimation/AnimatedDigit";
import AnimatedPeriod from "./DigitalAnimation/AnimatedPeriod";
import { motion } from "framer-motion";

interface DigitalProps {
  time: Date;
}

interface TimeState {
  hour: number;
  minute: number;
  period: string;
}

const Digital = ({ time }: DigitalProps) => {
  const { isOpen, hoveredIndex, employeeTimes } = useTeamClock();
  const [prevTime, setPrevTime] = useState<TimeState>({
    hour: 0,
    minute: 0,
    period: "AM",
  });

  const getFormattedTime = (): TimeState => {
    let hour: number;
    let minute: number;
    let period: string;

    if (hoveredIndex !== null && employeeTimes) {
      const [hourStr, minuteStr] = employeeTimes[hoveredIndex].split(":");
      hour = parseInt(hourStr);
      minute = parseInt(minuteStr);
    } else {
      hour = time.getHours();
      minute = time.getMinutes();
    }

    period = hour >= 12 ? "PM" : "AM";

    if (hour >= 12) {
      hour -= 12;
    }

    return { hour, minute, period };
  };

  const { hour, minute, period } = getFormattedTime();

  useEffect(() => {
    setPrevTime({ hour, minute, period });
  }, [hour, minute, period]);

  return (
    <motion.div
      className="absolute bottom-12 text-xl font-mono text-gray-400 flex items-center justify-center"
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <AnimatedDigit
        digit={Math.floor(hour / 10)}
        prevDigit={Math.floor(prevTime.hour / 10)}
      />
      <AnimatedDigit digit={hour % 10} prevDigit={prevTime.hour % 10} />
      :
      <AnimatedDigit
        digit={Math.floor(minute / 10)}
        prevDigit={Math.floor(prevTime.minute / 10)}
      />
      <AnimatedDigit digit={minute % 10} prevDigit={prevTime.minute % 10} />
      <AnimatedPeriod period={period} prevPeriod={prevTime.period} />
    </motion.div>
  );
};

export default Digital;

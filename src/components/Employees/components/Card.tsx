/* eslint-disable @next/next/no-img-element */
import { EmployeeProps } from "@/components/types";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import TimeDisplay from "./TimeDisplay";
import cn from "classnames";
import { useTeamClock } from "@/context/TeamClockContext";
import { AnimatePresence, motion } from "framer-motion";

interface TransitionProps {
  default?: {
    duration?: number;
    ease?: string;
  };
  opacity?: {
    duration?: number;
    ease?: string;
  };
}

interface CardProps extends EmployeeProps {
  time: string;
  timeDiff: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  index: number;
  sameTimeCount: number;
  isLastWithSameTime: boolean;
  sameTimeEmployees: EmployeeProps[];
  visibleCards: EmployeeProps[];
  setVisibleCards: React.Dispatch<React.SetStateAction<EmployeeProps[]>>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Card = ({
  id,
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
  sameTimeEmployees,
  visibleCards,
  setVisibleCards,
  containerRef,
}: CardProps) => {
  const {
    isOpen,
    containerRect,
    centerRect,
    clockRect,
    employeeTimes,
    animationComplete,
    isInitialRender,
    isSmallScreen,
  } = useTeamClock();
  const [sameRadiusWidth, setSameRadiusWidth] = useState(0);
  const [sameTimeEmployeesCount, setSameTimeEmployeesCount] =
    useState<number>(0);
  const [initialX, setInitialX] = useState<number>(0);
  const [initialY, setInitialY] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const modalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLButtonElement>(null);

  let divAnimate = { top: 0, left: 0 };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCards((prev) => {
            if (!prev.some((e) => e.id === id) && !isOpen) {
              return [...prev, { id, name, avatar, region, time, timeDiff }];
            }
            return prev;
          });
        } else {
          setVisibleCards((prev) => {
            if (!isOpen) {
              return prev.filter((e) => e.id !== id);
            }
            return prev;
          });
        }
      },
      {
        threshold: 0.3,
        root: containerRef.current,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [
    name,
    avatar,
    region,
    time,
    timeDiff,
    setVisibleCards,
    containerRef,
    id,
    isOpen,
  ]);

  useEffect(() => {
    if (isOpen && clockRect) {
      const sameTimeEmployees = employeeTimes?.slice(0, index).filter((t) => {
        const currentHour = parseInt(time.split(":")[0]);
        const tHour = parseInt(t.split(":")[0]);
        return (
          currentHour % 12 === tHour % 12 &&
          time.split(":")[1] === t.split(":")[1]
        );
      }).length;

      if (sameTimeEmployees) {
        setSameTimeEmployeesCount(sameTimeEmployees);
        sameTimeEmployees < 3
          ? setSameRadiusWidth(sameTimeEmployees * 10)
          : setSameRadiusWidth(20);
      }
    }
  }, [isOpen, clockRect, employeeTimes, time, index]);

  useEffect(() => {
    if (counterRef.current) {
      const rect = counterRef.current?.getBoundingClientRect();
      if (rect) {
        setModalPosition({
          top: rect.top,
          left: rect.left,
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (cardRef.current && containerRect) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setInitialX(cardRect.left - containerRect.left);
      setInitialY(cardRect.top - containerRect.top);
    }
  }, [containerRect, isSmallScreen]);

  const isVisible = useMemo(
    () => visibleCards.some((card) => card.id === id),
    [visibleCards, id]
  );

  const renderDivContent = useMemo(() => {
    let animateContent: any = {};
    let transition: TransitionProps = {
      default: { duration: 0.4, ease: "easeInOut" },
    };

    if (clockRect && containerRect && centerRect) {
      if (isOpen) {
        const timeParts = time.split(":");
        const hours = parseInt(timeParts[0]) % 12;
        const minutes = parseInt(timeParts[1]);

        const angle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
        const radius = clockRect.width / 2 - 20 - sameRadiusWidth;

        const clockCenterX =
          centerRect.left -
          containerRect.left +
          (isSmallScreen ? -16 : clockRect.width / 2 + 24);
        const clockCenterY =
          centerRect.top - containerRect.top + (isSmallScreen ? -17 : -14);

        const x = clockCenterX + radius * Math.cos(angle);
        const y = clockCenterY + radius * Math.sin(angle);

        animateContent = {
          top: y,
          left: x,
          opacity: 1,
        };

        divAnimate.top = y;
        divAnimate.left = x;

        if (!isVisible) {
          animateContent = {
            ...animateContent,
            opacity: [0, 1],
          };
          transition = {
            default: { duration: 0, ease: "easeInOut" },
            opacity: { duration: 0.4, ease: "easeInOut" },
          };
        }
      } else {
        if (id && Number(id) < 5) {
          animateContent = {
            top: animationComplete
              ? "auto"
              : isInitialRender
              ? "auto"
              : initialY,
            left: animationComplete
              ? "auto"
              : isInitialRender
              ? "auto"
              : initialX,
          };
        } else {
          animateContent = {
            opacity: animationComplete ? 1 : 0,
            top: animationComplete && "auto",
            left: animationComplete && "auto",
          };
        }
      }
    }

    return (
      <AnimatePresence initial={false}>
        <motion.div
          className={cn("absolute flex justify-between w-full md:max-w-72", {
            "px-2": !isOpen,
          })}
          onMouseEnter={animationComplete ? onMouseEnter : undefined}
          onMouseLeave={animationComplete ? onMouseLeave : undefined}
          animate={animateContent}
          transition={transition}
          layout
        >
          <div
            className={cn("flex justify-center gap-2 w-full md:max-w-64", {
              "items-center": !isOpen,
            })}
          >
            <motion.img
              src={avatar}
              alt={`${name} avatar's`}
              className={cn("size-10 rounded-full")}
              animate={{
                opacity: sameTimeEmployeesCount > 2 && isOpen ? 0 : 1,
              }}
            />
            <div className="w-full tracking-tighter">
              <motion.div
                className={cn("flex justify-between", {
                  "pr-4": isSmallScreen,
                })}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h4 className="text-lg font-bold truncate max-w-32">{name}</h4>
                <TimeDisplay
                  time={time}
                  timeDiff={timeDiff}
                  isHovered={isHovered}
                />
              </motion.div>
              <motion.div
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <p className="text-gray-500 text-sm truncate max-w-52">
                  {region}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }, [
    clockRect,
    containerRect,
    centerRect,
    isOpen,
    animationComplete,
    onMouseEnter,
    onMouseLeave,
    avatar,
    name,
    sameTimeEmployeesCount,
    time,
    timeDiff,
    isHovered,
    region,
    sameRadiusWidth,
    divAnimate,
    isVisible,
    id,
    isInitialRender,
    initialY,
    initialX,
    isSmallScreen,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        counterRef.current &&
        !counterRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  useEffect(() => {
    const updateModalPosition = () => {
      if (counterRef.current && containerRect) {
        const rect = counterRef.current.getBoundingClientRect();
        setModalPosition({
          top: rect.top - rect.height,
          left: rect.left + rect.width + 4,
        });
      }
    };

    updateModalPosition();
    if (showModal) {
      updateModalPosition();
    }

    window.addEventListener("resize", updateModalPosition);

    return () => {
      window.removeEventListener("resize", updateModalPosition);
    };
  }, [containerRect, showModal]);

  const renderModal = useMemo(() => {
    const filteredEmployees = sameTimeEmployees.filter((employee) => {
      if (!employee || !employee.time) {
        return false;
      }
      const employeeTime = employee.time.split(":");
      const currentTime = time.split(":");
      if (employeeTime.length !== 2 || currentTime.length !== 2) {
        return false;
      }
      const isSameTime =
        parseInt(employeeTime[0]) % 12 === parseInt(currentTime[0]) % 12 &&
        employeeTime[1] === currentTime[1];
      return isSameTime;
    });

    return (
      <AnimatePresence>
        {showModal && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white fixed shadow-md rounded-xl z-30 p-1 tracking-tighter border"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
          >
            <ul className="flex flex-col gap-2 custom-scrollbar max-h-60 overflow-x-hidden p-2">
              {filteredEmployees.map((employee, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <img
                    src={employee.avatar}
                    alt={`${employee.name}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between">
                      <p className="font-semibold">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {employee.region}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }, [
    modalPosition.left,
    modalPosition.top,
    sameTimeEmployees,
    showModal,
    time,
  ]);
  return (
    <div
      ref={cardRef}
      className={cn(
        "cursor-default flex items-center rounded-2xl min-h-16 border border-transparent overflow-hidden p-2",
        {
          "hover:bg-gray-100 hover:border-gray-200":
            !isOpen && animationComplete,
        }
      )}
    >
      {renderDivContent}
      {renderModal}
      {isOpen && sameTimeEmployeesCount > 2 && isLastWithSameTime && (
        <motion.button
          ref={counterRef}
          onClick={() => setShowModal((prev) => !prev)}
          className="size-10 rounded-full bg-gray-100 flex justify-center items-center absolute hover:bg-gray-200 z-10 cursor-pointer"
          style={{ top: divAnimate.top, left: divAnimate.left, opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          +{sameTimeCount - 2}
        </motion.button>
      )}
    </div>
  );
};

export default Card;

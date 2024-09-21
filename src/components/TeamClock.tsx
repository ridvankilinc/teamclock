import { TeamClockProvider, useTeamClock } from "@/context/TeamClockContext";
import ToggleButton from "./ToggleButton";
import Clock from "./Clock/Clock";
import cn from "classnames";
import Employees from "./Employees/Employees";
import { useEffect, useRef } from "react";

const employees = [
  {
    avatar:
      "https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109",
    name: "Sarah",
    region: "Skopje, Macedonia",
  },
  {
    avatar: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
    name: "Kumail",
    region: "Toronto, Canada",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=58",
    name: "Ethan",
    region: "San Francisco, America",
  },
  {
    avatar: "https://i.ibb.co/nLSRCCs/image1.jpg",
    name: "Ahmet",
    region: "Istanbul, Turkey",
  },
  // {
  //   avatar: "https://i.pravatar.cc/150?img=59",
  //   name: "Ahmet",
  //   region: "Rosario, Argentina",
  // },
  // {
  //   avatar: "https://i.pravatar.cc/150?img=60",
  //   name: "Ahmet",
  //   region: "Reykjavik, Iceland",
  // },
  {
    avatar: "https://i.pravatar.cc/150?img=55",
    name: "Ahmet",
    region: "Porto, Portugal",
  },
  // {
  //   avatar: "https://i.pravatar.cc/150?img=62",
  //   name: "Ahmet",
  //   region: "Kutaisi, Georgia",
  // },
  {
    avatar: "https://i.pravatar.cc/150?img=63",
    name: "Ahmet",
    region: "Chelyabinsk, Russia",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=64",
    name: "Ahmet",
    region: "Osh, Kyrgyzstan",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=69",
    name: "Sarah",
    region: "Skopje, Macedonia",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=70",
    name: "Sarah",
    region: "Skopje, Macedonia",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=5",
    name: "Sarah",
    region: "Skopje, Macedonia",
  },
  // {
  //   avatar: "https://i.pravatar.cc/150?img=65",
  //   name: "Ahmet",
  //   region: "Bangkok, Thailand",
  // },
  // {
  //   avatar: "https://i.pravatar.cc/150?img=66",
  //   name: "Ahmet",
  //   region: "Manila, Philippines",
  // },
  {
    avatar: "https://i.pravatar.cc/150?img=67",
    name: "Ahmet",
    region: "Tokyo, Japan",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=68",
    name: "Ahmet",
    region: "Wellington, New Zealand",
  },
];

const TeamClocks = () => {
  const { isOpen, setContainerRect, isSmallScreen } = useTeamClock();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const clockRect = containerRef.current.getBoundingClientRect();
      setContainerRect({
        width: clockRect.width,
        height: clockRect.height,
        left: clockRect.left,
        top: clockRect.top,
      });
    }
  }, [setContainerRect]);
  console.log(isSmallScreen);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col md:flex-row rounded-3xl container max-w-xs md:max-w-2xl bg-white overflow-hidden md:max-h-96 ",
        { "h-[38rem]": isSmallScreen }
      )}
    >
      <div
        className={cn("flex flex-col p-8 w-full gap-6", {
          "p-4 gap-3": isSmallScreen,
        })}
        style={{
          minWidth: isOpen ? "100%" : "50%",
          minHeight: isSmallScreen && isOpen ? "100%" : "50%",
          transition: "min-height 0.4s ease-in-out, min-width 0.4s ease-in-out",
        }}
      >
        <div className="flex justify-between items-center gap-4 md:max-w-64">
          <div className="text-3xl tracking-tighter font-bold">Team</div>
          <ToggleButton />
        </div>
        <div className={cn("flex justify-center items-center")}>
          <Clock />
        </div>
      </div>
      <div
        className={cn("p-6 bg-gray-50 md:rounded-r-2xl pr-2", {
          "p-3": isSmallScreen,
        })}
        style={{
          minWidth: isOpen ? "0%" : "50%",
          minHeight: isSmallScreen && isOpen ? "0" : "40%",
          transition: "0.4s ease-in-out",
        }}
      >
        <Employees employees={employees} />
      </div>
    </div>
  );
};

const TeamClock = () => (
  <TeamClockProvider>
    <TeamClocks />
  </TeamClockProvider>
);

export default TeamClock;

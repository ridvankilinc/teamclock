import { TeamClockProvider, useTeamClock } from "@/context/TeamClockContext";
import ToggleButton from "./ToggleButton";
import Clock from "./Clock/Clock";
import cn from "classnames";
import Employees from "./Employees/Employees";

const employees = [
  {
    avatar:
      "https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109",
    name: "Sarah",
    region: "Vancouver, Canada",
  },
  {
    avatar: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
    name: "Kumail",
    region: "Toronto, Canada",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=58",
    name: "Ethan",
    region: "San Francisco, USA",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=58",
    name: "Ethan",
    region: "San Francisco, USA",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=58",
    name: "Ethan",
    region: "San Francisco, USA",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=58",
    name: "Ethan",
    region: "San Francisco, USA",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=58",
    name: "Ethan",
    region: "San Francisco, USA",
  },
  {
    avatar: "https://i.ibb.co/nLSRCCs/image1.jpg",
    name: "Ahmet",
    region: "Istanbul, Turkiye",
  },
  {
    avatar: "https://i.ibb.co/nLSRCCs/image1.jpg",
    name: "Ahmet",
    region: "Istanbul, Turkiye",
  },
  {
    avatar: "https://i.ibb.co/nLSRCCs/image1.jpg",
    name: "Ahmet",
    region: "Istanbul, Turkiye",
  },
  {
    avatar: "https://i.ibb.co/nLSRCCs/image1.jpg",
    name: "Ahmet",
    region: "Istanbul, Turkiye",
  },
];

const TeamClocks = () => {
  const { isOpen } = useTeamClock();

  return (
    <div className="flex rounded-2xl container max-w-2xl bg-white overflow-hidden max-h-96">
      <div
        className="flex flex-col p-8 w-full justify-center"
        style={{
          minWidth: isOpen ? "100%" : "50%",
          transition: "min-width 0.4s ease-in-out",
        }}
      >
        <div className="flex justify-between items-center gap-4 mb-8 max-w-64">
          <div className="text-3xl tracking-tighter font-bold">Team</div>
          <ToggleButton />
        </div>
        <div className={cn("flex justify-center items-center")}>
          <Clock />
        </div>
      </div>
      <div
        className={cn("p-6 bg-gray-50 rounded-r-2xl pr-2")}
        style={{
          minWidth: isOpen ? "0%" : "50%",
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

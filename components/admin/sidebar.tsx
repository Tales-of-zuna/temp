"use client";
import { Button } from "@heroui/react";

const Sidebar = () => {
  return (
    <div className="h-full w-1/4 overflow-y-auto rounded-xl py-8 pl-8">
      <div className="flex h-full w-full flex-col space-y-4 rounded-3xl bg-neutral-800 p-8">
        <Button>Dashboard</Button>
        <Button>Player Stats</Button>
      </div>
    </div>
  );
};

export default Sidebar;

"use client";
import { Image } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const FourTeams = ({ teamsWithPlayers }: any) => {
  const [fourteams, setFourTeams] = useState<any[]>([]);

  useEffect(() => {
    if (!teamsWithPlayers) return;

    const aliveTeams = teamsWithPlayers.filter((team: any) =>
      team.players.some((player: any) => player.health > 0),
    );

    if (aliveTeams.length <= 4) {
      setFourTeams(aliveTeams);
    }
  }, [teamsWithPlayers]);

  return (
    <div className="absolute left-0 top-14 z-30 flex h-[55px] w-screen items-center justify-center gap-8">
      <div className="flex h-full w-[1300px] items-center justify-center gap-8">
        {fourteams?.map((team: any, index: number) => {
          return (
            <AnimatePresence key={team?.teamName}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="relative flex h-[55px] w-[250px] items-center justify-center"
              >
                <video
                  src="/assets/videos/fourteams.mp4"
                  className="h-full w-auto object-cover"
                  autoPlay
                  loop
                  muted
                ></video>
                <div className="absolute left-0 flex h-full w-[60px] items-center justify-center">
                  <Image
                    src={`/assets/images/teams/${team?.teamName}.png`}
                    alt=""
                    className="h-10 w-10 object-contain"
                  />

                  {/* <Image
                    src={`/assets/images/logo.png`}
                    alt=""
                    className="h-10 w-10 object-contain"
                  /> */}
                </div>
                <div className="absolute left-[60px] flex h-full w-[95px] items-center justify-center text-3xl font-bold text-neutral-800">
                  {team?.teamName}
                </div>
                <div className="absolute left-[155px] flex h-full w-[95px] items-center justify-center gap-1 py-2">
                  {team?.players?.map((player: any) => {
                    return (
                      <div
                        className={`flex h-full items-end bg-neutral-700`}
                        key={player?.uId}
                      >
                        <div
                          className={`w-[6px] ${player.liveState == 4 ? "bg-[#fb8500]" : "bg-green-600"}`}
                          style={{
                            height: `${(player?.health / player?.healthMax) * 100}%`,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
};

export default FourTeams;

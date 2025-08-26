"use client";
import { Image } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";

const Teams = ({ teamsWithPlayers, observedPlayer, teamScores }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute bottom-5 right-0 z-10 flex h-[812px] w-[425px] flex-col justify-start overflow-hidden"
    >
      <video
        src="assets/videos/teamList.mp4"
        className="absolute left-0 top-0 h-full w-full scale-y-125 object-contain object-top"
        autoPlay
        loop
        muted
      ></video>
      <div className="z-10 flex h-[40px] w-full items-center overflow-hidden bg-neutral-950 text-medium font-bold">
        <div className="flex h-full w-[40px] items-center justify-center text-white">
          #
        </div>
        <div className="flex h-full w-[140px] items-center justify-center">
          TEAMS
        </div>
        <div className="flex h-full w-[85px] items-center justify-center">
          ALIVE
        </div>
        <div className="flex h-full w-[70px] items-center justify-center">
          PTS
        </div>
        <div className="flex h-full w-[70px] items-center justify-center text-white">
          ELIMS
        </div>
      </div>
      <div className="z-10 h-full w-full">
        {teamsWithPlayers
          ?.map((team: any) => {
            const teamScore =
              teamScores?.find(
                (score: any) => score.teamName === team?.teamName,
              )?.totalPoints || 0;
            return {
              ...team,
              totalScore: teamScore + team.teamKillNum,
            };
          })
          .sort((a: any, b: any) => b.totalScore - a.totalScore)
          .map((team: any, index: number) => (
            <AnimatePresence key={index}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                exit={{ opacity: 0, x: 50 }}
                className={`flex h-[45.8px] w-full ${
                  team?.players?.some(
                    (player: any) => player.isOutsideBlueCircle === true,
                  ) && team?.players?.some((player: any) => player.health > 0)
                    ? "z-30 animate-pulse bg-blue-700 bg-opacity-30 backdrop-blur-lg"
                    : ""
                } text-xl font-bold ${
                  team?.players?.every((player: any) => player.health <= 0)
                    ? "bg-black bg-opacity-70 text-neutral-400 grayscale backdrop-blur-sm"
                    : "text-white"
                }`}
              >
                <div
                  className={`flex ${
                    team?.players?.some(
                      (player: any) => player.uId == observedPlayer,
                    )
                      ? "border-l-[8px] border-[#FEE75C]"
                      : ""
                  } h-full w-[40px] items-center justify-center overflow-hidden`}
                >
                  {index + 1}
                </div>
                <div className="relative flex h-full w-[140px] items-center justify-start text-medium">
                  <div className="flex w-[70px] justify-center">
                    <Image
                      src={`/assets/images/teams/${team?.teamName}.png`}
                      alt=""
                      className="aspect-square h-[30px]"
                    />
                    {/* <Image
                      src={`/assets/images/logo.png`}
                      alt=""
                      className="aspect-square h-[30px]"
                    /> */}
                  </div>
                  {team?.teamName}
                </div>

                <div className="flex h-full w-[85px] items-end justify-center gap-1 py-2">
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
                <div className="flex h-full w-[70px] items-center justify-center">
                  {team.totalScore}
                </div>
                <div className="flex h-full w-[70px] items-center justify-center">
                  {team?.teamKillNum}
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
      </div>
      <div className="absolute bottom-0 flex h-[42px] w-full items-center justify-around gap-2 bg-neutral-950 px-8 text-lg font-bold">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-green-600"></div>
          ALIVE
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-[#fb8500]"></div>
          KNOCKED
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-neutral-600"></div>
          ELIMINATED
        </div>
      </div>
    </motion.div>
  );
};

export default Teams;

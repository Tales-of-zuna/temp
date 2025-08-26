import { Image } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
const MatchRankings2 = ({ matchTeams, seriesName, matchName }: any) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/assets/videos/matchRanking.mp4"
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
      ></video>
      <div className="absolute bottom-2 left-0 z-20 grid h-[510px] w-full grid-cols-2 px-4 text-4xl font-bold">
        <div className="flex flex-col">
          {matchTeams?.slice(8, 12)?.map((team: any, index: number) => {
            const placementPoints = team?.totalPoints - team?.killCount;
            return (
              <AnimatePresence key={team?.teamId}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex h-[127.5px] items-center"
                >
                  <div className="flex h-full w-[260px] items-center justify-center">
                    #{index + 9}
                  </div>
                  <div className="flex h-full w-[135px] items-center justify-center">
                    {team?.teamName}
                  </div>
                  <div className="flex h-full w-[200px] items-center justify-center">
                    {placementPoints}
                  </div>
                  <div className="flex h-full w-[125px] items-center justify-center">
                    {team?.killCount}
                  </div>
                  <div className="flex h-full w-[185px] items-center justify-center pl-24">
                    {team?.totalPoints}
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        <div className="flex flex-col">
          {matchTeams?.slice(12, 16)?.map((team: any, index: number) => {
            const placementPoints = team?.totalPoints - team?.killCount;
            return (
              <AnimatePresence key={team?.teamId}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex h-[127.5px] items-center"
                >
                  <div className="flex h-full w-[290px] items-center justify-center">
                    #{index + 13}
                  </div>
                  <div className="flex h-full w-[135px] items-center justify-center">
                    {team?.teamName}
                  </div>
                  <div className="flex h-full w-[200px] items-center justify-center">
                    {placementPoints}
                  </div>
                  <div className="flex h-full w-[125px] items-center justify-center">
                    {team?.killCount}
                  </div>
                  <div className="flex h-full w-[185px] items-center justify-center pr-24">
                    {team?.totalPoints}
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>
      </div>
      {/* <div className="absolute left-4 top-16 z-20 flex w-full items-center text-6xl font-bold">
        Match Rankings
      </div> */}
      <div className="absolute left-4 top-[135px] z-20 flex h-[70px] w-[694px] items-center justify-around text-5xl font-bold uppercase text-neutral-800">
        <p>{matchName}</p>
        <p>{seriesName}</p>
      </div>
      <div className="absolute left-4 top-[220px] z-20 flex h-[276px] w-[1888px] text-3xl font-bold">
        <div className="w-[200px] p-4 text-4xl">
          <p className="text-neutral-800">#1</p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-[700px] items-center justify-center"
        >
          <Image
            src={`/assets/images/teams/${matchTeams[0]?.teamName}.png`}
            alt=""
            className="z-20 h-[250px] w-[700px] object-contain"
          />
        </motion.div>
        <div className="flex w-[230px] flex-col items-center justify-center uppercase text-neutral-800">
          {/* <p className="text-lg uppercase">team</p> */}
          <p className="text-6xl font-bold uppercase">
            {matchTeams[0].teamName}
          </p>
        </div>
        <div className="flex w-[230px] flex-col items-center justify-center pl-16 text-neutral-800">
          {/* <p className="uppercase">place pts</p> */}
          <p className="text-9xl font-bold uppercase">
            {matchTeams[0].totalPoints - matchTeams[0].killCount}
          </p>
        </div>
        <div className="flex w-[230px] flex-col items-center justify-center text-neutral-800">
          {/* <p className="uppercase">elims</p> */}
          <p className="text-9xl font-bold uppercase">
            {matchTeams[0].killCount}
          </p>
        </div>
        <div className="flex w-[230px] flex-col items-center justify-center pr-16 text-neutral-800">
          {/* <p className="uppercase">total pts</p> */}
          <p className="text-9xl font-bold uppercase">
            {matchTeams[0].totalPoints}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchRankings2;

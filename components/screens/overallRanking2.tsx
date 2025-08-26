import { Image } from "@heroui/react";
import { mdiFoodDrumstick } from "@mdi/js";
import Icon from "@mdi/react";
import { AnimatePresence, motion } from "framer-motion";
const OverallRanking2 = ({ teamsData, seriesName, matchName }: any) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/assets/videos/overallRanking.mp4"
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
      ></video>
      <div className="absolute bottom-[70px] right-[170px] z-20 h-[720px] w-[660px]">
        <div className="flex h-[80px] w-full items-center justify-between py-2">
          <div className="flex h-full w-full items-center text-xl font-bold uppercase">
            <div className="flex h-full w-[66px] items-center justify-center">
              RANK
            </div>
            <div className="flex h-full w-[198px] items-center justify-center">
              TEAM
            </div>
            <div className="flex h-full w-[132px] items-center justify-center">
              PLACE PTS
            </div>
            <div className="flex h-full w-[66px] items-center justify-center">
              ELIMS
            </div>
            <div className="flex h-full w-[132px] items-center justify-center text-orange-300">
              TOTAL PTS
            </div>
            <div className="flex h-full w-[66px] items-center justify-center text-orange-300">
              <Icon path={mdiFoodDrumstick} size={1} />
            </div>
          </div>
        </div>
        {teamsData?.slice(8, 16)?.map((team: any, index: any) => (
          <AnimatePresence key={index}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="flex h-[80px] w-full items-center justify-between py-2"
            >
              <div
                className={`flex h-full w-full items-center justify-center bg-white bg-opacity-20 text-2xl font-light text-neutral-800 backdrop-blur-xl`}
              >
                <div className="flex h-full w-[66px] items-center justify-center font-black">
                  #{index + 9}
                </div>
                <div className="flex h-full w-[198px] items-center justify-center gap-4">
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
                  <p className="w-[40px] font-black">{team?.teamName}</p>
                </div>
                <div className="flex h-full w-[132px] items-center justify-center">
                  {team?.totalPoints - team?.killCount}
                </div>
                <div className="flex h-full w-[66px] items-center justify-center">
                  {team?.killCount}
                </div>
                <div className="flex h-full w-[132px] items-center justify-center font-black">
                  {team?.totalPoints}
                </div>
                <div className="flex h-full w-[66px] items-center justify-center font-black">
                  {team?.winCount}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
      <div className="absolute bottom-[100px] left-[170px] z-20 flex h-[100px] w-[800px] items-center text-7xl font-bold">
        <span className="mr-4 text-yellow-600">#1</span>{" "}
        {teamsData[0]?.teamName}
      </div>
      <div className="absolute bottom-[200px] left-[170px] z-20 flex h-[500px] w-[800px] items-center text-5xl font-bold">
        <div className="relative h-full w-full">
          <Image
            src={`/assets/images/teams/${teamsData[0]?.teamName}.png`}
            // src={`/assets/images/logo.png`}
            alt=""
            className="h-[500px] w-[800px] object-contain"
          />
        </div>
      </div>

      <div
        className={`absolute right-[255px] top-[210px] z-20 flex h-[65px] w-[570px] transform items-center justify-around text-4xl font-bold uppercase transition-all duration-1000 ease-in-out`}
      >
        <p className="text-neutral-800">{matchName}</p>
        <p className="text-neutral-800">{seriesName}</p>
      </div>
    </div>
  );
};

export default OverallRanking2;

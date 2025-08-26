import { Image } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
const TeamDamage = ({ selectedTeam }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }} // Start hidden and below its position
      animate={{ opacity: 1, x: 0 }} // Animate to full visibility
      exit={{ opacity: 0, x: -50 }} // Exit animation
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
      className="absolute bottom-[280px] left-0 z-10 h-[350px] w-[250px]"
    >
      <div className="relative h-full w-full">
        <video
          src="/assets/videos/damageStat.mp4"
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
        ></video>
      </div>
      <div className="absolute top-0 h-full w-full">
        <div className="flex h-[20px] w-full items-center justify-center text-xl font-semibold uppercase"></div>
        <div className="flex h-[90px] w-full items-center justify-center gap-2">
          <Image
            src={`/assets/images/teams/${selectedTeam?.teamName}.png`}
            alt=""
            className="h-[60px] w-[60px] object-cover"
          />
          {/* <Image
            src={`/assets/images/logo.png`}
            alt=""
            className="h-[60px] w-[60px] object-cover"
          /> */}
          <p className="text-3xl font-bold text-neutral-800">
            {selectedTeam?.teamName}
          </p>
        </div>
        <div className="h-[250px] w-full">
          {selectedTeam?.players?.map((player: any, index: any) => {
            const damagePercentage = selectedTeam?.teamDamage
              ? ((player?.damage !== 0 ? player?.damage : 1) /
                  selectedTeam?.teamDamage) *
                100
              : 0;
            return (
              <AnimatePresence key={player?.uId}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-[60px] w-full bg-black bg-opacity-50 px-3 py-1 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      <p>{selectedTeam?.teamName}</p>
                      <p>{player.playerName}</p>
                    </div>
                    <p>{player.damage}</p>
                  </div>
                  <div className="flex h-[20px] w-full gap-2 bg-neutral-800 pr-2">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width: `${damagePercentage}%`,
                      }}
                    ></div>
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })}
          {/* {Array.from({ length: 4 - selectedTeam?.players?.length }).map(
            (_, index) => (
              <AnimatePresence key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-[60px] w-full bg-black bg-opacity-50 px-3 py-1 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between font-bold">
                    <p>Empty Slot</p>
                    <p>0</p>
                  </div>
                  <div className="flex h-[20px] w-full gap-2 bg-neutral-800 pr-2">
                    <div className="h-full w-full bg-gray-500"></div>
                    <p className="text-sm">0%</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ),
          )} */}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamDamage;

import { Image } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";

const WinnerTeam = ({
  mvpPlayer,
  seriesName,
  matchName,
  matchWinners,
  screenIndex,
}: any) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/assets/videos/teamStat.mp4"
        autoPlay
        muted
        className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
      ></video>

      <div
        className={`transform transition-all duration-1000 ease-in-out ${
          screenIndex === 1
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        } absolute bottom-[358px] left-[22px] z-20 flex h-[60px] w-[530px] items-center text-4xl font-bold uppercase text-neutral-800`}
      >
        <div className="flex w-[300px] items-center justify-center">
          <p className="">{seriesName}</p>
        </div>
        <div className="flex w-[230px] items-center justify-center">
          <p className="">{matchName}</p>
        </div>
      </div>

      <div
        className={`transform transition-all delay-150 duration-1000 ease-in-out ${
          screenIndex === 1
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        } absolute bottom-[450px] left-[22px] z-20 flex h-[250px] w-[530px] flex-col items-center justify-center text-4xl font-bold`}
      >
        <p className="text-9xl">Winner</p>
        <p className="text-5xl">Team Stats</p>
      </div>

      <div
        className={`absolute bottom-[75px] right-0 z-20 flex h-[130px] w-[1360px] items-center text-4xl font-bold`}
      >
        {matchWinners?.map((player: any, index: any) => {
          return (
            <AnimatePresence key={player.uId}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`transform transition-all duration-1000 ease-in-out ${
                  screenIndex === 1
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                } flex h-full w-[335.5px] items-center justify-center`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="z-50 text-white">{player.playerName}</p>
              </motion.div>
            </AnimatePresence>
          );
        })}
        {Array.from({ length: 4 - matchWinners?.length }).map((_, index) => (
          <div key={index}>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`transform transition-all duration-1000 ease-in-out ${
                  screenIndex === 1
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                } flex h-full w-[335.5px] items-center justify-center`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <p className="z-50 text-white">Empty Slot</p>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Player stats */}
      <div
        className={`absolute bottom-[205px] right-0 z-20 flex h-[900px] w-[1360px] items-end text-4xl font-bold`}
      >
        <div className="flex h-full items-end">
          {matchWinners?.map((player: any, index: any) => {
            return (
              <div key={player.uId}>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative transform transition-all duration-1000 ease-in-out ${
                      screenIndex === 1
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    } z-20 flex h-full w-[334px] flex-col items-start justify-end space-y-8 bg-gradient-to-t from-black to-transparent p-4`}
                    style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                  >
                    {/* <div className="absolute left-0 top-0 z-20 h-[900px] w-full bg-gradient-to-t from-black to-transparent"></div> */}
                    <div className="z-30 text-[#CFE356]">
                      <p className="text-5xl">{player.killNum}</p>
                      <p className="text-medium">ELIMS</p>
                    </div>
                    <div className="z-30 text-[#CFE356]">
                      <p className="text-5xl">{player.damage}</p>
                      <p className="text-medium">DAMAGE</p>
                    </div>
                    <div className="z-30 text-[#CFE356]">
                      <p className="text-5xl">{player.knockouts}</p>
                      <p className="text-medium">KNOCKOUTS</p>
                    </div>
                    <div className="z-30 text-[#CFE356]">
                      <p className="text-5xl">{player.rescueTimes}</p>
                      <p className="text-medium">RESCUE</p>
                    </div>

                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="absolute bottom-0 right-0 z-10 flex h-full w-full items-end"
                      >
                        {/* change */}
                        {/* <Image
                          src={`/assets/images/players/${player?.uId}.png`}
                          alt=""
                          className="h-[600px] w-[335.5px] object-cover object-bottom"
                        /> */}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`transform transition-all duration-1000 ease-in-out ${
          screenIndex === 1
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        } absolute bottom-[100px] left-[22px] z-20 flex h-[250px] w-[530px] items-center justify-center text-4xl font-bold`}
        style={{ transitionDelay: "300ms" }}
      >
        <Image
          src={`/assets/images/teams/${mvpPlayer?.teamName}.png`}
          className="h-32 w-32 object-contain"
          alt=""
        />
        {/* <Image
          src={`/assets/images/logo.png`}
          className="h-32 w-32 object-contain"
          alt=""
        /> */}
        <p className="text-7xl">{mvpPlayer?.teamName}</p>
      </div>
    </div>
  );
};

export default WinnerTeam;

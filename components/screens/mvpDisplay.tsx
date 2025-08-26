import { Divider, Image } from "@heroui/react";
import { motion } from "framer-motion";

const MVPDisplay = ({ seriesName, matchName, mvpPlayer }: any) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/assets/videos/mvp.mp4"
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 z-10 h-full w-full scale-[1.02] object-cover"
      ></video>
      <div
        className={`transform transition-all duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} absolute left-0 top-0 z-20 flex h-full w-[750px] flex-col justify-end text-3xl font-bold`}
      >
        <div className="flex flex-col items-center gap-8 p-8">
          <p className="text-7xl font-black uppercase">
            {seriesName} | {matchName}
          </p>
          <Divider className="w-[600px]" />
          {/* <p className="text-9xl">MVP</p> */}
          <div className="flex items-center gap-4">
            {/* <Image
              src={`/assets/images/logo.png`}
              className="h-32 w-32 object-contain"
              alt=""
            /> */}
            <Image
              src={`/assets/images/teams/${mvpPlayer?.teamName}.png`}
              className="h-32 w-32 object-contain"
              alt=""
            />
            <div>
              <p className="text-orange-500">{mvpPlayer?.teamName}</p>
              <p className="text-5xl">{mvpPlayer?.playerName}</p>
            </div>
          </div>
        </div>
        <div
          className={`flex w-[750px] transform justify-center transition-all delay-75 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} relative`}
        >
          <Image
            src={`/assets/images/players/${mvpPlayer?.uId}.png`}
            alt=""
            className="h-[600px] w-[450px] rounded-none object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-20 grid h-[600px] w-[1180px] grid-cols-2 items-center justify-center gap-8 p-24 text-3xl font-bold">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          exit={{ opacity: 0, y: 50 }}
          className={`col-span-1 transform bg-white bg-opacity-10 p-4 backdrop-blur-2xl transition-all delay-100 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
        >
          <p className="text-9xl">{mvpPlayer?.killNum || 0}</p>
          <p className="text-orange-500">ELIMS</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          exit={{ opacity: 0, y: 50 }}
          className={`col-span-1 transform bg-white bg-opacity-10 p-4 backdrop-blur-2xl transition-all delay-300 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
        >
          <p className="text-9xl">{mvpPlayer?.rescueTimes || 0}</p>
          <p className="text-orange-500">RESCUE TIMES</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          exit={{ opacity: 0, y: 50 }}
          className={`col-span-1 transform bg-white bg-opacity-10 p-4 backdrop-blur-2xl transition-all delay-700 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
        >
          <p className="text-9xl">{mvpPlayer?.assist || 0}</p>
          <p className="text-orange-500">ASSISTS</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          exit={{ opacity: 0, y: 50 }}
          className={`col-span-1 transform bg-white bg-opacity-10 p-4 backdrop-blur-2xl transition-all delay-1000 duration-1000 ease-in-out ${mvpPlayer?.teamName ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} flex flex-col items-center justify-center`}
        >
          <p className="text-9xl">{mvpPlayer?.damage || 0}</p>
          <p className="text-orange-500">DAMAGE</p>
        </motion.div>
      </div>
      <div className="absolute left-8 top-8 z-20 flex items-center text-4xl font-bold uppercase opacity-20">
        Winner winner chicken dinner
      </div>
    </div>
  );
};

export default MVPDisplay;

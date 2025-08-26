import { Image } from "@heroui/react";
import { motion } from "framer-motion";
const PlayerImage = ({ observedPlayer }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start hidden and below its position
      animate={{ opacity: 1, y: 0 }} // Animate to full visibility
      exit={{ opacity: 0, y: 50 }} // Exit animation
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
      className="absolute bottom-0 left-[450px] z-10 flex h-[200px] w-[200px] flex-col items-center justify-end"
    >
      <div className="relative flex h-full w-full items-end justify-center">
        {/* change */}
        {/* <Image
          src={`/assets/images/players/${observedPlayer}.png`}
          alt=""
          className="h-[200px] w-[200px] object-contain"
        /> */}
        <Image
          src={`/assets/images/logo.png`}
          alt=""
          className="h-[200px] w-[200px] object-contain"
        />
      </div>
    </motion.div>
  );
};
export default PlayerImage;

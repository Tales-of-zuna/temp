"use client";
import { AnimatePresence, motion } from "framer-motion";
const Popup = ({ activePopups, totalPlayerList }: any) => {
  const popups = activePopups?.data || [];

  return (
    <div
      className="absolute left-0 top-0 z-10 h-screen w-screen overflow-hidden"
      // style={{
      //   backgroundImage:
      //     "url('/assets/images/screens/Screenshot 2025-02-17 181725.png')",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <AnimatePresence>
        {popups.includes("socialplatforms") && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Start hidden and below its position
            animate={{ opacity: 1, y: 0 }} // Animate to full visibility
            exit={{ opacity: 0, y: 50 }} // Exit animation
            transition={{ duration: 1, ease: "easeOut" }} // Smooth transition
            className="absolute bottom-[20px] left-[450px] z-10 flex h-[180px] w-[1080px] flex-col items-center justify-end bg-cyan-600 bg-opacity-30"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popup;

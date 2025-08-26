"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const TestNotifs = () => {
  const [notificationQueue, setNotificationQueue] = useState<any[]>([]);
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const notificationTimeoutRef = useRef<any>(null);

  // Queue processor
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const [next, ...rest] = notificationQueue;
      setCurrentNotification(next);
      setNotificationQueue(rest);

      if (!notificationTimeoutRef.current) {
        notificationTimeoutRef.current = setTimeout(() => {
          setCurrentNotification(null);
          notificationTimeoutRef.current = null;
        }, 5000);
      }
    }
  }, [notificationQueue, currentNotification]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const addNotification = useCallback((type: string) => {
    const id = crypto.randomUUID();
    setNotificationQueue((prev) => [
      ...prev,
      { id, type, timestamp: Date.now() },
    ]);
  }, []);

  // Notification display
  const NotificationDisplay = ({ notification }: any) => {
    const getContent = () => {
      switch (notification.type) {
        case "firstBlood":
          return { title: "FIRST BLOOD", icon: "🩸" };
        case "teamEliminated":
          return { title: "TEAM ELIMINATED", icon: "☠️" };
        default:
          return { title: "NOTIFICATION", icon: "🔔" };
      }
    };

    const content = getContent();

    return (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="relative w-[400px] rounded-lg bg-black/70 p-4 text-white shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">{content.icon}</span>
          <h2 className="text-2xl font-bold">{content.title}</h2>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10">
      <button
        onClick={() => addNotification("firstBlood")}
        className="rounded bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-600"
      >
        Trigger First Blood
      </button>

      <button
        onClick={() => addNotification("teamEliminated")}
        className="rounded bg-gray-700 px-6 py-3 font-bold text-white hover:bg-gray-800"
      >
        Trigger Team Eliminated
      </button>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {currentNotification && (
            <NotificationDisplay
              key={currentNotification.id} // ✅ only changes on new notif
              notification={currentNotification}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestNotifs;

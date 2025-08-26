import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const AutoNotifs = ({
  totalPlayerList,
  circleInfo,
  teamInfo,
  isInGame,
}: any) => {
  const [notificationQueue, setNotificationQueue] = useState<any[]>([]);
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [circleTimer, setCircleTimer] = useState<number | null>(null);

  const circleTimerIntervalRef = useRef<any>(null);
  const firstBloodShownRef = useRef(false);
  const prevPlayersRef = useRef<any>({});
  const prevTeamInfoRef = useRef<any>({});
  const notificationTimeoutRef = useRef<any>(null);
  const processingQueueRef = useRef(false);

  useEffect(() => {
    if (
      notificationQueue.length > 0 &&
      !currentNotification &&
      !processingQueueRef.current
    ) {
      processingQueueRef.current = true;
      const [next, ...rest] = notificationQueue;
      setNotificationQueue(rest);
      setCurrentNotification(next);

      notificationTimeoutRef.current = setTimeout(() => {
        setCurrentNotification(null);
        processingQueueRef.current = false;
      }, 5000);
    }

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [notificationQueue, currentNotification]);

  const addNotification = useCallback((type: string, data: any) => {
    const id = crypto.randomUUID();
    const newNotification = {
      id,
      type,
      data,
      timestamp: Date.now(),
    };

    setNotificationQueue((prev) => [...prev, newNotification]);
  }, []);

  useEffect(() => {
    if (isInGame) {
      firstBloodShownRef.current = false;
      prevPlayersRef.current = {};
      prevTeamInfoRef.current = {};
      setNotificationQueue([]);
      setCurrentNotification(null);
    }
  }, [isInGame]);

  useEffect(() => {
    if (!isInGame || !teamInfo) return;

    Object.entries(teamInfo).forEach(([teamId, team]: any) => {
      const prevTeam = prevTeamInfoRef.current[teamId];

      if (prevTeam && prevTeam.liveMemberNum > 0 && team.liveMemberNum === 0) {
        addNotification("teamEliminated", {
          teamName: team.teamName,
          kills: team.killNum,
        });
      }

      prevTeamInfoRef.current[teamId] = { ...team };
    });
  }, [teamInfo, addNotification, isInGame]);

  useEffect(() => {
    if (!totalPlayerList?.length || !isInGame) return;

    totalPlayerList.forEach((player: any) => {
      const prevPlayer = prevPlayersRef.current[player.uId] || {
        killNumByGrenade: 0,
        killNumInVehicle: 0,
        killNum: 0,
      };

      if (!firstBloodShownRef.current && player.killNum > 0) {
        firstBloodShownRef.current = true;

        if (player.killNumByGrenade > 0) {
          addNotification("firstBloodGrenade", {
            playerName: player.playerName,
            teamName: player.teamName,
          });
        } else if (player.killNumInVehicle > 0) {
          addNotification("firstBloodVehicle", {
            playerName: player.playerName,
            teamName: player.teamName,
          });
        } else {
          addNotification("firstBlood", {
            playerName: player.playerName,
            teamName: player.teamName,
          });
        }
      } else {
        if (
          player.killNumByGrenade > prevPlayer.killNumByGrenade &&
          firstBloodShownRef.current
        ) {
          const isFirstGrenadeKill = !Object.values(
            prevPlayersRef.current,
          ).some((p: any) => p.killNumByGrenade > 0);

          if (isFirstGrenadeKill) {
            addNotification("firstGrenadeKill", {
              playerName: player.playerName,
              teamName: player.teamName,
            });
          }
        }

        if (
          player.killNumInVehicle > prevPlayer.killNumInVehicle &&
          firstBloodShownRef.current
        ) {
          const isFirstVehicleKill = !Object.values(
            prevPlayersRef.current,
          ).some((p: any) => p.killNumInVehicle > 0);

          if (isFirstVehicleKill) {
            addNotification("firstVehicleKill", {
              playerName: player.playerName,
              teamName: player.teamName,
            });
          }
        }
      }

      prevPlayersRef.current[player.uId] = {
        killNumByGrenade: player.killNumByGrenade,
        killNumInVehicle: player.killNumInVehicle,
        killNum: player.killNum,
      };
    });
  }, [totalPlayerList, addNotification, isInGame]);

  useEffect(() => {
    if (!circleInfo || !isInGame) return;

    const Counter = Number(circleInfo.Counter);
    const MaxTime = Number(circleInfo.MaxTime);
    const CircleStatus = Number(circleInfo.CircleStatus);
    const timeRemaining = MaxTime - Counter;

    if (timeRemaining <= 20 && Counter < MaxTime && CircleStatus === 0) {
      setCircleTimer(timeRemaining);

      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
      }

      const intervalId = setInterval(() => {
        setCircleTimer((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalId);
            return null;
          }
        });
      }, 1000);

      circleTimerIntervalRef.current = intervalId;
    } else {
      setCircleTimer(null);
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
        circleTimerIntervalRef.current = null;
      }
    }

    return () => {
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
      }
    };
  }, [circleInfo, isInGame]);

  const NotificationDisplay = ({ notification }: any) => {
    if (!notification) return null;

    const getNotificationContent = () => {
      switch (notification.type) {
        case "firstBlood":
          return {
            title: "FIRST BLOOD",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            bgColor: "from-red-600 to-red-800",
            icon: "🩸",
          };
        case "firstBloodGrenade":
          return {
            title: "FIRST BLOOD",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            subtext: "GRENADE KILL",
            bgColor: "from-orange-600 to-red-800",
            icon: "💥",
          };
        case "firstBloodVehicle":
          return {
            title: "FIRST BLOOD",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            subtext: "VEHICLE KILL",
            bgColor: "from-purple-600 to-red-800",
            icon: "🚗",
          };
        case "firstGrenadeKill":
          return {
            title: "FIRST GRENADE KILL",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            bgColor: "from-orange-500 to-orange-700",
            icon: "💣",
          };
        case "firstVehicleKill":
          return {
            title: "FIRST VEHICLE KILL",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            bgColor: "from-purple-500 to-purple-700",
            icon: "🚙",
          };
        case "teamEliminated":
          return {
            title: "TEAM ELIMINATED",
            subtitle: notification.data.teamName,
            subtext: `${notification.data.kills} ELIMINATIONS`,
            bgColor: "from-gray-700 to-gray-900",
            icon: "☠️",
          };
        default:
          return null;
      }
    };

    const content = getNotificationContent();
    if (!content) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        className="relative w-[500px]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <video
            src="/assets/videos/mininotif.mp4"
            autoPlay
            loop
            muted
            className="h-full w-full object-cover opacity-30"
          />
        </div>

        <div
          className={`relative bg-gradient-to-r ${content.bgColor} rounded-lg border border-white/20 shadow-2xl backdrop-blur-sm`}
        >
          <div className="flex items-center p-6">
            <div className="mr-6 animate-pulse text-5xl">{content.icon}</div>

            <div className="flex-1">
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-1 text-3xl font-black uppercase tracking-wider text-white"
              >
                {content.title}
              </motion.h2>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <p className="text-xl font-bold uppercase text-yellow-300">
                  {content.subtitle}
                </p>
                {content.team && (
                  <span className="text-lg text-white/80">
                    [{content.team}]
                  </span>
                )}
              </motion.div>

              {content.subtext && (
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-1 text-sm font-semibold uppercase text-white/70"
                >
                  {content.subtext}
                </motion.p>
              )}
            </div>
          </div>

          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["200% 0", "-200% 0"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="absolute left-1/2 top-[15%] z-50 -translate-x-1/2 transform">
        <AnimatePresence mode="wait">
          {currentNotification && (
            <NotificationDisplay notification={currentNotification} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {circleTimer !== null && (
          <div className="absolute left-[275px] top-[120px] z-10 flex h-[100px] w-[315px] bg-cyan-600 bg-opacity-30">
            <video
              src="assets/videos/circleTimer.mp4"
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
            ></video>
            <div className="absolute right-0 top-0 flex h-full w-[90px] items-center justify-center text-4xl font-bold text-slate-800">
              {circleTimer}
            </div>
            <div className="absolute right-0 top-0 flex h-full w-[200px] items-center justify-center text-wrap text-center text-3xl font-bold uppercase"></div>
          </div>
        )}
      </AnimatePresence>

      {notificationQueue.length > 0 && (
        <div className="absolute left-1/2 top-[35%] z-40 -translate-x-1/2 transform">
          <div className="flex gap-2">
            {notificationQueue.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 animate-pulse rounded-full bg-white/50"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AutoNotifs;

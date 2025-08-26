import { Image } from "@heroui/react";
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

  // Track all "once per game" notifications with dedicated refs
  const firstBloodShownRef = useRef(false);
  const firstGrenadeKillShownRef = useRef(false);
  const firstVehicleKillShownRef = useRef(false);

  // Track processed events to prevent duplicates
  const processedEventsRef = useRef<Set<string>>(new Set());
  const prevPlayersRef = useRef<Map<string, any>>(new Map());
  const prevTeamInfoRef = useRef<Map<string, any>>(new Map());
  const notificationTimeoutRef = useRef<any>(null);

  // Reset all "once per game" flags when game starts
  useEffect(() => {
    if (isInGame) {
      // Only reset if we're transitioning INTO a game
      if (!prevPlayersRef.current.size) {
        firstBloodShownRef.current = false;
        firstGrenadeKillShownRef.current = false;
        firstVehicleKillShownRef.current = false;
        processedEventsRef.current.clear();
        prevPlayersRef.current.clear();
        prevTeamInfoRef.current.clear();
        setNotificationQueue([]);
        setCurrentNotification(null);

        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
          notificationTimeoutRef.current = null;
        }
      }
    } else {
      // Game ended - clear everything
      prevPlayersRef.current.clear();
      prevTeamInfoRef.current.clear();
      processedEventsRef.current.clear();
    }
  }, [isInGame]);

  // Improved queue processing without flickering
  // Queue processor (only show one at a time)
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const [next, ...rest] = notificationQueue;
      setCurrentNotification(next);
      setNotificationQueue(rest);

      // Start timeout only once
      if (!notificationTimeoutRef.current) {
        notificationTimeoutRef.current = setTimeout(() => {
          setCurrentNotification(null);
          notificationTimeoutRef.current = null;
        }, 5000);
      }
    }
  }, [notificationQueue, currentNotification]);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const addNotification = useCallback(
    (type: string, data: any, eventId?: string) => {
      // If eventId is provided, check if we've already processed this event
      if (eventId && processedEventsRef.current.has(eventId)) {
        return;
      }

      if (eventId) {
        processedEventsRef.current.add(eventId);
      }

      const id = crypto.randomUUID();
      const newNotification = {
        id,
        type,
        data,
        timestamp: Date.now(),
      };

      setNotificationQueue((prev) => [...prev, newNotification]);
    },
    [],
  );

  // Team elimination tracking
  // Team elimination tracking
  useEffect(() => {
    if (!isInGame || !teamInfo) return;

    Object.entries(teamInfo).forEach(([teamId, team]: any) => {
      const prevTeam = prevTeamInfoRef.current.get(teamId);

      if (prevTeam && prevTeam.liveMemberNum > 0 && team.liveMemberNum === 0) {
        const eventId = `team_eliminated_${teamId}`; // stable ID
        addNotification(
          "teamEliminated",
          {
            teamName: team.teamName,
            kills: team.killNum,
          },
          eventId,
        );
      }

      prevTeamInfoRef.current.set(teamId, { ...team });
    });
  }, [teamInfo, addNotification, isInGame]);

  // Optimized player kill tracking
  // Kill tracking
  useEffect(() => {
    if (!totalPlayerList?.length || !isInGame) return;

    let totalGameKills = 0;
    let totalGrenadeKills = 0;
    let totalVehicleKills = 0;

    totalPlayerList.forEach((p: any) => {
      totalGameKills += p.killNum || 0;
      totalGrenadeKills += p.killNumByGrenade || 0;
      totalVehicleKills += p.killNumInVehicle || 0;

      const prevPlayer = prevPlayersRef.current.get(p.uId) || {
        killNumByGrenade: 0,
        killNumInVehicle: 0,
        killNum: 0,
      };

      const newKills = p.killNum - prevPlayer.killNum;
      const newGrenadeKills = p.killNumByGrenade - prevPlayer.killNumByGrenade;
      const newVehicleKills = p.killNumInVehicle - prevPlayer.killNumInVehicle;

      // First blood
      if (!firstBloodShownRef.current && newKills > 0 && totalGameKills === 1) {
        firstBloodShownRef.current = true;
        const eventId = "first_blood";
        if (p.killNumByGrenade > 0) {
          addNotification(
            "firstBloodGrenade",
            { playerName: p.playerName, teamName: p.teamName },
            eventId,
          );
          firstGrenadeKillShownRef.current = true;
        } else if (p.killNumInVehicle > 0) {
          addNotification(
            "firstBloodVehicle",
            { playerName: p.playerName, teamName: p.teamName },
            eventId,
          );
          firstVehicleKillShownRef.current = true;
        } else {
          addNotification(
            "firstBlood",
            { playerName: p.playerName, teamName: p.teamName },
            eventId,
          );
        }
      }

      // First grenade kill
      if (
        firstBloodShownRef.current &&
        !firstGrenadeKillShownRef.current &&
        newGrenadeKills > 0 &&
        totalGrenadeKills === 1
      ) {
        firstGrenadeKillShownRef.current = true;
        addNotification(
          "firstGrenadeKill",
          { playerName: p.playerName, teamName: p.teamName },
          "first_grenade_kill",
        );
      }

      // First vehicle kill
      if (
        firstBloodShownRef.current &&
        !firstVehicleKillShownRef.current &&
        newVehicleKills > 0 &&
        totalVehicleKills === 1
      ) {
        firstVehicleKillShownRef.current = true;
        addNotification(
          "firstVehicleKill",
          { playerName: p.playerName, teamName: p.teamName },
          "first_vehicle_kill",
        );
      }

      prevPlayersRef.current.set(p.uId, {
        killNumByGrenade: p.killNumByGrenade,
        killNumInVehicle: p.killNumInVehicle,
        killNum: p.killNum,
      });
    });
  }, [totalPlayerList, addNotification, isInGame]);

  // Circle timer logic
  useEffect(() => {
    if (!circleInfo || !isInGame) {
      setCircleTimer(null);
      if (circleTimerIntervalRef.current) {
        clearInterval(circleTimerIntervalRef.current);
        circleTimerIntervalRef.current = null;
      }
      return;
    }

    const Counter = Number(circleInfo.Counter);
    const MaxTime = Number(circleInfo.MaxTime);
    const CircleStatus = Number(circleInfo.CircleStatus);
    const timeRemaining = MaxTime - Counter;

    if (timeRemaining <= 20 && timeRemaining > 0 && CircleStatus === 0) {
      // Only set up new timer if we don't have one or the time changed significantly
      if (circleTimer === null || Math.abs(circleTimer - timeRemaining) > 1) {
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
      }
    } else if (timeRemaining <= 0 || CircleStatus !== 0) {
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
  }, [circleInfo, isInGame, circleTimer]);

  const NotificationDisplay = ({ notification }: any) => {
    if (!notification) return null;

    const getNotificationContent = () => {
      switch (notification.type) {
        case "firstBlood":
          return {
            title: "FIRST BLOOD",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            bgColor: "bg-red-600 bg-opacity-20 backdrop-blur-xl",
            icon: "🩸",
          };
        case "firstBloodGrenade":
          return {
            title: "FIRST BLOOD",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            subtext: "GRENADE KILL",
            bgColor: "bg-purple-600 bg-opacity-20 backdrop-blur-xl",
            icon: "💥",
          };
        case "firstBloodVehicle":
          return {
            title: "FIRST BLOOD",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            subtext: "VEHICLE KILL",
            bgColor: "bg-green-600 bg-opacity-20 backdrop-blur-xl",
            icon: "🚗",
          };
        case "firstGrenadeKill":
          return {
            title: "FIRST GRENADE KILL",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            bgColor: "bg-yellow-600 bg-opacity-20 backdrop-blur-xl",
            icon: "💣",
          };
        case "firstVehicleKill":
          return {
            title: "FIRST VEHICLE KILL",
            subtitle: notification.data.playerName,
            team: notification.data.teamName,
            bgColor: "bg-blue-600 bg-opacity-20 backdrop-blur-xl",
            icon: "🚙",
          };
        case "teamEliminated":
          return {
            title: "TEAM ELIMINATED",
            team: notification.data.teamName,
            subtitle: notification.data.teamName,
            subtext: `${notification.data.kills} ELIMINATIONS`,
            bgColor: "bg-black bg-opacity-20 backdrop-blur-xl",
            icon: "☠️",
          };
        default:
          return null;
      }
    };

    const content = getNotificationContent();
    if (!content) return null;

    return (
      <motion.div className="relative w-[350px]">
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <video
            src="/assets/videos/background.mp4"
            autoPlay
            loop
            muted
            className="h-full w-full object-cover object-bottom"
          />
        </div>

        <div
          className={`relative rounded-lg border border-white/20 bg-white bg-opacity-20 shadow-2xl`}
        >
          <div className="flex items-center p-6">
            <div className="">
              <Image
                src={`/assets/images/teams/${content.team}.png`}
                alt=""
                className="aspect-square h-20"
              />
            </div>

            <div className="flex-1">
              <motion.h2 className="mb-1 text-3xl font-black uppercase tracking-wider text-white">
                {content.title}
              </motion.h2>

              <motion.div className="flex items-center gap-2">
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
                <motion.p className="mt-1 text-sm font-semibold uppercase text-white/70">
                  {content.subtext}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Kill notif */}
      <div className="absolute left-1/2 top-[15%] z-50 -translate-x-1/2 transform">
        <AnimatePresence mode="wait">
          {currentNotification && (
            <NotificationDisplay
              key={currentNotification.id}
              notification={currentNotification}
            />
          )}
        </AnimatePresence>
      </div>
      {/* circle timer */}
      <AnimatePresence>
        {circleTimer !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-[275px] top-[120px] z-10 flex h-[100px] w-[315px] bg-cyan-600 bg-opacity-30"
          >
            <video
              src="assets/videos/circleTimer.mp4"
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
            />
            <div className="absolute right-0 top-0 flex h-full w-[90px] items-center justify-center text-4xl font-bold text-slate-800">
              {circleTimer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {notificationQueue.length > 0 && (
        <div className="absolute left-1/2 top-[35%] z-40 -translate-x-1/2 transform">
          <div className="flex gap-2">
            {notificationQueue.slice(0, 3).map((_, index) => (
              <motion.div
                key={`queue-${index}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
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

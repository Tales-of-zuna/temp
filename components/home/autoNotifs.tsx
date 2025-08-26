"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const AutoNotifs = ({
  totalPlayerList,
  circleInfo,
  teamInfo,
  isInGame,
}: any) => {
  const [notifications, setNotifications] = useState<any>([]);
  const [circleTimer, setCircleTimer] = useState<any>(null);
  const circleTimerIntervalRef = useRef<any>(null);
  const firstBloodShownRef = useRef(false);

  const prevPlayersRef = useRef<any>({});
  const prevTeamInfoRef = useRef<any>(null);

  const addNotification = useCallback((type: any, data: any) => {
    const id = crypto.randomUUID();
    const newNotification = { id, type, data, timestamp: Date.now() };

    setNotifications((prev: any) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev: any) =>
        prev.filter((notif: any) => notif.id !== id),
      );
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isInGame || !teamInfo) return;

    if (prevTeamInfoRef.current?.liveMemberNum === teamInfo.liveMemberNum) {
      prevTeamInfoRef.current = teamInfo;
      return;
    }

    if (teamInfo.liveMemberNum === 0) {
      addNotification("teamEliminated", {
        teamName: teamInfo.teamName,
        kills: teamInfo.killNum,
      });
    }

    prevTeamInfoRef.current = teamInfo;
  }, [teamInfo, addNotification, isInGame]);

  useEffect(() => {
    if (!totalPlayerList?.length || !isInGame) return;

    totalPlayerList.forEach((player: any) => {
      const prevPlayer = prevPlayersRef.current[player.id] || {
        killNumByGrenade: 0,
        killNumInVehicle: 0,
        killNum: 0,
      };

      // First blood logic
      if (!firstBloodShownRef.current && player.killNum > 0) {
        firstBloodShownRef.current = true;

        let killType = "firstBlood";

        if (player.killNumByGrenade > 0) {
          killType = "firstBloodGrenade";
        } else if (player.killNumInVehicle > 0) {
          killType = "firstBloodVehicle";
        }

        addNotification(killType, {
          playerName: player.playerName,
        });
      }

      // Track grenade kills
      if (player.killNumByGrenade > prevPlayer.killNumByGrenade) {
        addNotification("grenadeKill", {
          playerName: player.playerName,
        });
      }

      // Track vehicle kills
      if (player.killNumInVehicle > prevPlayer.killNumInVehicle) {
        addNotification("vehicleKill", {
          playerName: player.playerName,
        });
      }

      prevPlayersRef.current[player.id] = {
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
        setCircleTimer((prev: any) => {
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

  const renderNotification = (notification: any) => {
    // switch (notification.type) {
    //   case "teamEliminated":
    //     return (
    //       <div
    //         key={notification.id}
    //         className="absolute left-[830px] top-[200px] z-10 flex h-[90px] w-[275px] bg-cyan-600 bg-opacity-30"
    //       >
    //         {notification.data.teamName}
    //         {notification.data.kills}
    //         <p className="text-xl font-bold">Eliminated</p>
    //       </div>
    //     );
    //   case "grenadeKill":
    //   case "vehicleKill":
    //   case "firstBlood":
    //   case "firstBloodGrenade":
    //   case "firstBloodVehicle":
    //     return (
    //       <motion.div
    //         key={notification.id}
    //         initial={{ opacity: 0, x: 50 }}
    //         animate={{ opacity: 1, x: 0 }}
    //         transition={{ duration: 0.5 }}
    //         className="absolute left-0 top-[350px] z-10 flex w-96 items-center justify-center"
    //       >
    //         <video
    //           src="assets/videos/mininotif.mp4"
    //           autoPlay
    //           loop
    //           muted
    //           className="h-full w-full object-cover"
    //         ></video>
    //         <div className="absolute left-0 top-2 z-30 flex w-full items-center justify-center font-bold">
    //           <p className="text-5xl text-neutral-800">
    //             {notification.type === "firstBlood" && `FIRST BLOOD`}
    //             {notification.type === "firstBloodGrenade" &&
    //               `FIRST GRENADE KILL`}
    //             {notification.type === "firstBloodVehicle" &&
    //               `FIRST VEHICLE KILL`}
    //             {notification.type === "grenadeKill" && `GRENADE KILL`}
    //             {notification.type === "vehicleKill" && `VEHICLE KILL`}
    //           </p>
    //         </div>
    //         <div className="absolute bottom-0 left-0 w-full text-center uppercase">
    //           <p className="text-white">{notification.data.playerName}</p>
    //         </div>
    //       </motion.div>
    //     );
    //   default:
    //     return null;
    // }
  };

  return (
    <div className="absolute left-0 top-0 z-10">
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
    </div>
  );
};

export default AutoNotifs;

"use client";
import AutoNotifs from "@/components/home/autoNotifs";
import Popup from "@/components/home/popups";
import BattleScreen from "@/components/home/postgame";
import Toggle from "@/components/home/toggle";
import useBroadcastListeners from "@/hooks/useBroadcastListener";
import { useEffect, useState } from "react";

const DATA_FETCH_INTERVAL = 2000;

const Home = () => {
  const {
    activeScreen,
    activePopups,
    activeToggles,
    matchName,
    seriesName,
    mapName,
  } = useBroadcastListeners();

  const [gameData, setGameData] = useState({
    totalPlayerList: [],
    observedPlayer: null,
    circleInfo: null,
    teamInfo: null,
    isInGame: null,
  });
  const [teamScores, setTeamScores] = useState<any>([]);

  const fetchAllData = async () => {
    try {
      const [playersRes, observedRes, circleRes, teamRes, isInGameRes] =
        await Promise.all([
          fetch("/api/battle"),
          fetch("/api/observed"),
          fetch("/api/circleinfo"),
          fetch("/api/teamInfo"),
          fetch("/api/isInGame"),
        ]);

      const [totalPlayerList, observedPlayer, circleInfo, teamInfo, isInGame] =
        await Promise.all([
          playersRes.json(),
          observedRes.json(),
          circleRes.json(),
          teamRes.json(),
          isInGameRes.json(),
        ]);

      setGameData({
        totalPlayerList,
        observedPlayer,
        circleInfo,
        teamInfo,
        isInGame,
      });
    } catch (err) {
      console.error("Error fetching game data:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, DATA_FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTeamScores = async () => {
      try {
        const res = await fetch("/api/gameData");
        const teamScores = await res.json();
        setTeamScores(teamScores);
        console.log(teamScores);
      } catch (error) {
        console.log("Error fetching team scores:", error);
      }
    };
    fetchTeamScores();
  }, []);

  return (
    <div className="h-screen w-screen bg-[#00ff00]">
      <BattleScreen
        totalPlayerList={gameData.totalPlayerList}
        activeScreen={activeScreen}
        matchName={matchName}
        seriesName={seriesName}
        isInGame={gameData.isInGame}
      />
      <Popup
        totalPlayerList={gameData.totalPlayerList}
        activePopups={activePopups}
      />
      <AutoNotifs
        teamInfo={gameData.teamInfo}
        circleInfo={gameData.circleInfo}
        totalPlayerList={gameData.totalPlayerList}
        isInGame={gameData.isInGame}
      />
      <Toggle
        observedPlayer={gameData.observedPlayer}
        totalPlayerList={gameData.totalPlayerList}
        activeToggles={activeToggles}
        matchName={matchName}
        seriesName={seriesName}
        mapName={mapName}
        teamScores={teamScores}
      />
    </div>
  );
};

export default Home;

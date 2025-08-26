import { useEffect, useState } from "react";
import MatchRankings from "../screens/matchRanking";
import MatchRankings2 from "../screens/matchRanking2";
import MVPDisplay from "../screens/mvpDisplay";
import OverallRanking from "../screens/overallRanking";
import OverallRanking2 from "../screens/overallRanking2";
import WinnerTeam from "../screens/winnerTeam";

const popupChannel = new BroadcastChannel("popup");
const toggleChannel = new BroadcastChannel("toggle");

const BattleScreen = ({
  totalPlayerList,
  isInGame,
  seriesName,
  matchName,
}: any) => {
  const [screenIndex, setScreenIndex] = useState(0);
  const [teamsData, setTeamsData] = useState<any>([]);
  const [mvpPlayer, setMvpPlayer] = useState<any>(null);
  const [matchWinners, setMatchWinners] = useState<any>([]);
  const [matchTeams, setMatchTeams] = useState<any>([]);
  const [isMvpCalculated, setIsMvpCalculated] = useState<boolean>(false); // MVP calculation status

  const saveTeamData = async () => {
    const teamStats: any = {};
    totalPlayerList.forEach((player: any) => {
      const { teamId, teamName, killNum, rank } = player;

      if (!teamStats[teamId]) {
        teamStats[teamId] = {
          teamName,
          teamId,
          totalPoints: 0,
          winCount: 0,
          killCount: 0,
          bestRank: Infinity,
        };
      }

      teamStats[teamId].killCount += killNum;
      teamStats[teamId].bestRank = Math.min(teamStats[teamId].bestRank, rank);
    });
    Object.values(teamStats).forEach((team: any) => {
      const { bestRank } = team;

      if (bestRank === 1) {
        team.winCount += 1;
        team.totalPoints += 10;
      } else if (bestRank === 2) {
        team.totalPoints += 6;
      } else if (bestRank === 3) {
        team.totalPoints += 5;
      } else if (bestRank === 4) {
        team.totalPoints += 4;
      } else if (bestRank === 5) {
        team.totalPoints += 3;
      } else if (bestRank === 6) {
        team.totalPoints += 2;
      } else if (bestRank === 7 || bestRank === 8) {
        team.totalPoints += 1;
      }

      team.totalPoints += team.killCount;
    });

    const teamsToUpdate = Object.values(teamStats);
    teamsToUpdate.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
    setMatchTeams(teamsToUpdate);
  };

  useEffect(() => {
    if (isInGame == true && teamsData.length > 0) {
      return;
    }

    saveTeamData();

    const rankedPlayers = totalPlayerList?.filter(
      (player: any) => player.rank == 1,
    );

    setMatchWinners(rankedPlayers);
    if (rankedPlayers.length > 0) {
      const mvp = rankedPlayers.reduce((topPlayer: any, current: any) =>
        current.killNum > topPlayer.killNum ? current : topPlayer,
      );

      setMvpPlayer(mvp);
      setIsMvpCalculated(true);
    }

    popupChannel.postMessage({ data: [] });
    toggleChannel.postMessage({ data: [] });
  }, [isInGame]);

  useEffect(() => {
    if (isInGame == true) {
      return;
    }
    if (screenIndex == 2) {
      const fetchTeamsData = async () => {
        try {
          const res = await fetch("/api/gameData");
          const data = await res.json();
          data.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
          setTeamsData(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTeamsData();
    }
  }, [screenIndex, isInGame]);

  useEffect(() => {
    if (isInGame == true) {
      return;
    }

    const screenDurations = [35000, 13000, 35000, 35000, 35000, 35000];
    let index = 0;

    const cycleScreens = () => {
      setScreenIndex(index);
      index++;

      if (index < screenDurations.length) {
        setTimeout(cycleScreens, screenDurations[index]);
      }
    };

    cycleScreens();

    return () => {
      index = screenDurations.length;
    };
  }, [isInGame]);

  if (isInGame == true) {
    return <div className="h-screen w-screen bg-transparent"></div>;
  }

  if (!isMvpCalculated) {
    return <div className="bg-[#00ff00]"></div>;
  }

  return (
    <div>
      {screenIndex === 0 && (
        <MVPDisplay
          mvpPlayer={mvpPlayer}
          seriesName={seriesName}
          matchName={matchName}
          screenIndex={screenIndex}
        />
      )}
      {screenIndex === 1 && (
        <WinnerTeam
          seriesName={seriesName}
          matchName={matchName}
          matchWinners={matchWinners}
          mvpPlayer={mvpPlayer}
          screenIndex={screenIndex}
        />
      )}
      {screenIndex === 2 && (
        <MatchRankings
          matchTeams={matchTeams}
          seriesName={seriesName}
          matchName={matchName}
          screenIndex={screenIndex}
        />
      )}
      {screenIndex === 3 && (
        <MatchRankings2
          matchTeams={matchTeams}
          seriesName={seriesName}
          matchName={matchName}
          screenIndex={screenIndex}
        />
      )}
      {screenIndex === 4 && (
        <OverallRanking
          teamsData={teamsData}
          seriesName={seriesName}
          matchName={matchName}
          screenIndex={screenIndex}
        />
      )}
      {screenIndex === 5 && (
        <OverallRanking2
          teamsData={teamsData}
          seriesName={seriesName}
          matchName={matchName}
          screenIndex={screenIndex}
        />
      )}
    </div>
  );
};

export default BattleScreen;

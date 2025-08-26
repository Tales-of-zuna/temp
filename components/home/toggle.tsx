"use clien";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import FourTeams from "../toggles/fourTeams";
import Plane from "../toggles/plane";
import PlayerImage from "../toggles/playerImage";
import Sponsors from "../toggles/sponsors";
import TeamDamage from "../toggles/teamDamage";
import Teams from "../toggles/teams";

const Toggle = ({
  activeToggles,
  totalPlayerList,
  observedPlayer,
  matchName,
  seriesName,
  mapName,
  teamScores,
}: any) => {
  const toggles = activeToggles?.data || [];
  const [teamsWithPlayers, setTeamsWithPlayers] = useState<any>();
  const [selectedTeam, setSelectedTeam] = useState<any>();

  useEffect(() => {
    const transformData = (list: any) => {
      const teamsWithPlayers = list?.reduce((acc: any, player: any) => {
        const { teamId, teamName } = player;

        if (!acc[teamId]) {
          acc[teamId] = {
            teamId,
            teamName,
            teamKillNum: 0,
            teamDamage: 0,
            players: [],
          };
        }

        acc[teamId].players.push(player);
        acc[teamId].teamKillNum += player.killNum;
        acc[teamId].teamDamage += player.damage;

        return acc;
      }, {});

      return Object.values(teamsWithPlayers);
    };

    if (totalPlayerList?.length !== 0) {
      const groupedPlayers = transformData(totalPlayerList);
      const sortedPlayers = groupedPlayers?.sort((a: any, b: any) => {
        return b.teamKillNum - a.teamKillNum;
      });
      setTeamsWithPlayers(sortedPlayers);
    }
  }, [totalPlayerList]);

  useEffect(() => {
    teamsWithPlayers?.forEach((team: any) => {
      if (team.players.some((player: any) => player?.uId == observedPlayer)) {
        setSelectedTeam(team);
      }
    });
  }, [observedPlayer, teamsWithPlayers]);

  return (
    <div className="absolute left-0 top-0 z-10 h-screen w-screen overflow-hidden">
      <AnimatePresence>
        {toggles?.includes("teams") && (
          <Teams
            teamsWithPlayers={teamsWithPlayers}
            observedPlayer={observedPlayer}
            teamScores={teamScores}
          />
        )}
      </AnimatePresence>
      {toggles?.includes("lastfourteams") && (
        <div className="h-32 w-32 bg-red-500">last four</div>
      )}
      <AnimatePresence>
        {toggles?.includes("plane") && (
          <Plane
            mapName={mapName}
            seriesName={seriesName}
            matchName={matchName}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toggles?.includes("playerimage") && (
          <PlayerImage observedPlayer={observedPlayer} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toggles?.includes("sponsors") && (
          <Sponsors seriesName={seriesName} matchName={matchName} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toggles?.includes("teamdamage") && (
          <TeamDamage selectedTeam={selectedTeam} />
        )}
      </AnimatePresence>
      {toggles?.includes("fourteams") && (
        <FourTeams teamsWithPlayers={teamsWithPlayers} />
      )}
    </div>
  );
};

export default Toggle;

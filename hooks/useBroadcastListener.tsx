import { useEffect, useState } from "react";

const screenChannel = new BroadcastChannel("screen");
const popupChannel = new BroadcastChannel("popup");
const toggleChannel = new BroadcastChannel("toggle");
const matchChannel = new BroadcastChannel("match");
const seriesChannel = new BroadcastChannel("series");
const mapChannel = new BroadcastChannel("map");

const popupTimeout = 5000;

const useBroadcastListeners = () => {
  const [activeScreen, setActiveScreen] = useState("none");
  const [activePopups, setActivePopups] = useState<any>({});
  const [activeToggles, setActiveToggles] = useState({});
  const [seriesName, setSeriesName] = useState<string>("");
  const [matchName, setMatchName] = useState<string>("");
  const [mapName, setMapName] = useState<string>("");

  useEffect(() => {
    const handlePopupMessage = (e: MessageEvent) => setActivePopups(e.data);
    const handleScreenMessage = (e: MessageEvent) => setActiveScreen(e.data);
    const handleToggleMessage = (e: MessageEvent) => setActiveToggles(e.data);
    const handleMatchMessage = (e: MessageEvent) => setMatchName(e.data);
    const handleSeriesMessage = (e: MessageEvent) => setSeriesName(e.data);
    const handleMapMessage = (e: MessageEvent) => setMapName(e.data);

    popupChannel.addEventListener("message", handlePopupMessage);
    screenChannel.addEventListener("message", handleScreenMessage);
    toggleChannel.addEventListener("message", handleToggleMessage);
    matchChannel.addEventListener("message", handleMatchMessage);
    seriesChannel.addEventListener("message", handleSeriesMessage);
    mapChannel.addEventListener("message", handleMapMessage);

    return () => {
      popupChannel.removeEventListener("message", handlePopupMessage);
      screenChannel.removeEventListener("message", handleScreenMessage);
      toggleChannel.removeEventListener("message", handleToggleMessage);
      matchChannel.removeEventListener("message", handleMatchMessage);
      seriesChannel.removeEventListener("message", handleSeriesMessage);
      mapChannel.removeEventListener("message", handleMapMessage);
    };
  }, []);

  useEffect(() => {
    if (activePopups.data !== null) {
      const timeout = setTimeout(() => {
        setActivePopups({});
        popupChannel.postMessage({});
      }, popupTimeout);
      return () => clearTimeout(timeout);
    }
  }, [activePopups]);

  return {
    activeScreen,
    activePopups,
    activeToggles,
    seriesName,
    matchName,
    mapName,
  };
};

export default useBroadcastListeners;

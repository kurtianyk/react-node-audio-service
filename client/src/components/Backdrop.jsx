import React, { useEffect } from "react";

const Backdrop = ({ trackIndex, isPlaying }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--active-color", "#5f9fff");
  }, [trackIndex]);

  return <div className={`color-backdrop ${isPlaying ? "playing" : "idle"}`} />;
};

export default Backdrop;

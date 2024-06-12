import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveSurferComponent = ({ audioUrl }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#4A90E2",
        height: 200,
      });

      wavesurfer.load(audioUrl);

      return () => wavesurfer.destroy();
    }
  }, [audioUrl]);

  return <div ref={waveformRef} />;
};

export default WaveSurferComponent;

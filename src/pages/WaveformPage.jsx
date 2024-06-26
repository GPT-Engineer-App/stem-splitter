import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { Box } from "@chakra-ui/react";

const WaveSurferComponent = ({ audioUrl }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#ff5500",
      });

      wavesurfer.load(audioUrl);

      return () => {
        wavesurfer.destroy();
      };
    }
  }, [audioUrl]);

  return <Box ref={waveformRef} width="100%" height="200px" />;
};

export default WaveSurferComponent;

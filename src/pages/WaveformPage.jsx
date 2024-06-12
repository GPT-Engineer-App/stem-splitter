import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { Box } from "@chakra-ui/react";

const WaveformPage = () => {
  const waveformRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#ff5500",
      });

      wavesurfer.load("/path/to/your/audio/file.mp3");

      return () => {
        wavesurfer.destroy();
      };
    }
  }, [waveformRef]);

  return <Box ref={waveformRef} width="100%" height="200px" />;
};

export default WaveformPage;

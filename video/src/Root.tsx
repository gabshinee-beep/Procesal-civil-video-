import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { duracionTotal } from "./tiempos";
import { FPS, W, H } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="Maqueta" component={Video} durationInFrames={duracionTotal()} fps={FPS} width={W} height={H} defaultProps={{ modo: "completo" as const }} />
    <Composition id="Primeros20" component={Video} durationInFrames={20 * FPS} fps={FPS} width={W} height={H} defaultProps={{ modo: "completo" as const }} />
    <Composition id="Respaldo" component={Video} durationInFrames={duracionTotal()} fps={FPS} width={W} height={H} defaultProps={{ modo: "respaldo" as const }} />
  </>
);

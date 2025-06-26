import { useState, useMemo } from "react";

import { MAX_LEVEL } from "~/lib/constants";
import { initGame } from "~/lib/game";

import Home from "~/pages/Home";
import GameSession from "~/pages/GameSession";

// @ts-ignore
import "@fontsource/press-start-2p";
import "./App.css";

export default function App() {
  const [session, setSession] = useState(null as Session | null);
  const [forceSession, setForceSession] = useState(false);
  const [player, setPlayer] = useState(null as Player | null);
  useMemo(() => initGame(setSession, setPlayer), []);

  const playing = session && session.pending.length + session.failed.length;
  const showXP = !player || player.lvl !== MAX_LEVEL;

  return (
    <>
      {playing || (session && forceSession) ? (
        <GameSession
          session={session}
          setShowingResults={setForceSession}
          showXP={showXP}
        />
      ) : (
        player && <Home player={player} />
      )}
    </>
  );
}

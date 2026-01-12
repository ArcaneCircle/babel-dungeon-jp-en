import { useState, useMemo } from "react";

import { MAX_LEVEL } from "~/lib/constants";
import { initGame } from "~/lib/game";

import Home from "~/pages/Home";
import GameSession from "~/pages/GameSession";
import Welcome from "~/pages/Welcome";

// @ts-ignore
import "@fontsource/press-start-2p";
import "./App.css";

export default function App() {
  const [session, setSession] = useState(null as Session | null);
  const [forceSession, setForceSession] = useState(false);
  const [player, setPlayer] = useState(null as Player | null);
  const [welcomeComplete, setWelcomeCompleteState] = useState(false);
  useMemo(() => initGame(setSession, setPlayer, setWelcomeCompleteState), []);

  const playing = session && session.pending.length + session.failed.length;
  const showXP = !player || player.lvl !== MAX_LEVEL;

  // don't render anything if initialization hasn't finished
  if (!player) return;

  return (
    <>
      {!welcomeComplete ? (
        <Welcome />
      ) : playing || (session && forceSession) ? (
        <GameSession
          session={session}
          setShowingResults={setForceSession}
          showXP={showXP}
        />
      ) : (
        <Home player={player} />
      )}
    </>
  );
}

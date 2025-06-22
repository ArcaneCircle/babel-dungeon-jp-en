import { useState, useCallback, useMemo } from "react";

import { MAX_LEVEL, PLAY_ENERGY_COST } from "~/lib/constants";
import { initGame, startNewGame } from "~/lib/game";
import { getSFXEnabled } from "~/lib/storage";
import { clickSfx } from "~/lib/sounds";

import Home from "~/pages/Home";
import GameSession from "~/pages/GameSession";
import LevelUpModal from "~/components/modals/LevelUpModal";
import ResultsModal from "~/components/modals/ResultsModal";
import NoEnergyModal from "~/components/modals/NoEnergyModal";
import InvalidBackupModal from "~/components/modals/InvalidBackupModal";
import IntroModal from "~/components/modals/IntroModal";
import CreditsModal from "~/components/modals/CreditsModal";
import SettingsModal from "~/components/modals/SettingsModal";

// @ts-ignore
import "@fontsource/press-start-2p";
import "./App.css";

export default function App() {
  const [session, setSession] = useState(null as Session | null);
  const [player, setPlayer] = useState(null as Player | null);
  const [modal, setModal] = useState(null as ModalPayload | null);
  useMemo(() => initGame(setSession, setPlayer, setModal), []);

  let modalComp = null;
  const onClose = useCallback(() => {
    setModal(null);
  }, []);
  const onShowSettings = useCallback(() => {
    if (getSFXEnabled()) clickSfx.play();
    setModal({ type: "settings" });
  }, []);

  if (modal === null) {
  } else if (modal.type === "levelUp") {
    modalComp = useMemo(() => {
      return (
        <LevelUpModal
          level={modal.newLevel}
          energy={modal.newEnergy}
          isOpen={true}
          onClose={onClose}
        />
      );
    }, [modal, onClose]);
  } else if (modal.type === "results") {
    modalComp = useMemo(
      () => (
        <ResultsModal
          isOpen={true}
          onClose={() => setModal(modal.next)}
          time={modal.time}
          xp={modal.xp}
          accuracy={modal.accuracy}
        />
      ),
      [modal],
    );
  } else if (modal.type === "noEnergy") {
    modalComp = useMemo(
      () => <NoEnergyModal isOpen={true} onClose={onClose} />,
      [onClose],
    );
  } else if (modal.type === "invalidBackup") {
    modalComp = useMemo(
      () => <InvalidBackupModal isOpen={true} onClose={onClose} />,
      [onClose],
    );
  } else if (modal.type === "intro") {
    modalComp = useMemo(
      () => <IntroModal isOpen={true} onClose={onClose} />,
      [onClose],
    );
  } else if (modal.type === "credits") {
    modalComp = useMemo(
      () => <CreditsModal isOpen={true} onClose={onClose} />,
      [onClose],
    );
  } else if (modal.type === "settings") {
    modalComp = useMemo(
      () => (
        <SettingsModal
          isOpen={true}
          onClose={onClose}
          onShowCredits={() => setModal({ type: "credits" })}
        />
      ),
      [onClose],
    );
  }
  const playing = session && session.pending.length + session.failed.length;
  const showingResults = !!(
    session &&
    modal &&
    (modal.type === "results" || modal.type === "levelUp")
  );
  const showXP = !player || player.lvl !== MAX_LEVEL;
  const onPlay = useCallback(() => {
    if (player === null) return;
    if (player.energy >= PLAY_ENERGY_COST) {
      startNewGame();
    } else {
      setModal({ type: "noEnergy" });
    }
  }, [player]);

  return (
    <>
      {modalComp}
      {playing || showingResults
        ? useMemo(
            () => (
              <GameSession
                session={session}
                showXP={showXP}
                showingResults={showingResults}
              />
            ),
            [session, showXP, showingResults],
          )
        : player &&
          useMemo(
            () => (
              <Home
                player={player}
                onShowSettings={onShowSettings}
                onPlay={onPlay}
              />
            ),
            [player, onShowSettings, onPlay],
          )}
    </>
  );
}

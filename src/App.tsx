import { useState } from "react";

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
  const [_ignore] = useState(() => initGame(setSession, setPlayer, setModal));

  let modalComp = null;
  const onClose = () => {
    setModal(null);
  };
  const onShowSettings = () => {
    if (getSFXEnabled()) clickSfx.play();
    setModal({ type: "settings" });
  };

  if (modal === null) {
  } else if (modal.type === "levelUp") {
    const closeLevelUp = () => {
      setModal(modal.next);
    };
    modalComp = (
      <LevelUpModal
        level={modal.newLevel}
        energy={modal.newEnergy}
        isOpen={true}
        onClose={closeLevelUp}
      />
    );
  } else if (modal.type === "results") {
    modalComp = (
      <ResultsModal
        isOpen={true}
        onClose={onClose}
        time={modal.time}
        xp={modal.xp}
        accuracy={modal.accuracy}
      />
    );
  } else if (modal.type === "noEnergy") {
    modalComp = <NoEnergyModal isOpen={true} onClose={onClose} />;
  } else if (modal.type === "invalidBackup") {
    modalComp = <InvalidBackupModal isOpen={true} onClose={onClose} />;
  } else if (modal.type === "intro") {
    modalComp = <IntroModal isOpen={true} onClose={onClose} />;
  } else if (modal.type === "credits") {
    modalComp = <CreditsModal isOpen={true} onClose={onClose} />;
  } else if (modal.type === "settings") {
    const onShowCredits = () => {
      setModal({ type: "credits" });
    };
    modalComp = (
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        onShowCredits={onShowCredits}
      />
    );
  }
  const playing = session && session.pending.length + session.failed.length;
  const showXP = !player || player.lvl !== MAX_LEVEL;
  const onPlay = () => {
    if (player === null) return;
    if (player.energy >= PLAY_ENERGY_COST) {
      startNewGame();
    } else {
      setModal({ type: "noEnergy" });
    }
  };

  return (
    <>
      {modalComp}
      {playing ? (
        <GameSession session={session} showXP={showXP} />
      ) : (
        player && (
          <Home
            player={player}
            onShowSettings={onShowSettings}
            onPlay={onPlay}
          />
        )
      )}
    </>
  );
}

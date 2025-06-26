import { useState, useEffect, useMemo, useCallback } from "react";
import PixelThumbsupSolid from "~icons/pixel/thumbsup-solid";
import PixelThumbsdownSolid from "~icons/pixel/thumbsdown-solid";

import { MAIN_COLOR, RED } from "~/lib/constants";
import { _ } from "~/lib/i18n";
import { getTTSEnabled, getSFXEnabled } from "~/lib/storage";
import { successSfx, errorSfx, clickSfx } from "~/lib/sounds";
import { getCard, sendMonsterUpdate } from "~/lib/game";
import { tts } from "~/lib/tts";

import { ModalContext } from "~/components/modals/Modal";
import MonsterCard from "~/components/MonsterCard";
import Meanings from "~/components/Meanings";
import StatusBar from "~/components/StatusBar";
import LevelUpModal from "~/components/modals/LevelUpModal";
import ResultsModal from "~/components/modals/ResultsModal";

const baseBtn = {
  width: "50%",
  color: "white",
  border: "none",
  padding: "0.6em 0.5em",
  fontSize: "1.5em",
};

const statusBarStyle = {
  position: "sticky",
  top: 0,
  backgroundColor: "black",
};

interface Props {
  setShowingResults: (showing: boolean) => void;
  showXP: boolean;
  session: Session;
}

export default function GameSession({
  setShowingResults,
  showXP,
  session,
}: Props) {
  const monster =
    session.pending[0] ||
    session.failed[0] ||
    session.correct[session.correct.length - 1];
  return (
    <Quiz
      key={monster.id}
      showXP={showXP}
      session={session}
      monster={monster}
      setShowingResults={setShowingResults}
    />
  );
}

function Quiz({
  setShowingResults,
  showXP,
  session,
  monster,
}: Props & { monster: Monster }) {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(null as ModalPayload | null);

  const defaultMode = session.mode === "easy";
  const ttsEnabled = getTTSEnabled();
  const sfxEnabled = getSFXEnabled();
  const { sentence, meanings } = getCard(monster.id);

  const showingResults = !!modal;

  useEffect(() => {
    if (ttsEnabled && defaultMode && !showingResults) tts(sentence);
  }, [monster, showingResults]);

  const pendingCount = session.failed.length + session.pending.length;

  const onFailed = useCallback(() => {
    setShow(false);
    const ttsWillSpeak = ttsEnabled && defaultMode;
    if (sfxEnabled && !ttsWillSpeak) errorSfx.play();
    sendMonsterUpdate(monster, false);
  }, [monster, ttsEnabled, sfxEnabled, defaultMode]);
  const onCorrect = useCallback(() => {
    const ttsWillSpeak = ttsEnabled && defaultMode;
    if (sfxEnabled && (!ttsWillSpeak || pendingCount === 1)) {
      successSfx.play();
    }
    const mod = sendMonsterUpdate(monster, true);
    setShowingResults(!!mod);
    setModal(mod);
  }, [monster, ttsEnabled, sfxEnabled, defaultMode, pendingCount]);
  const onShow = useCallback(() => {
    if (ttsEnabled && !defaultMode) {
      tts(sentence);
    } else if (sfxEnabled) {
      clickSfx.play();
    }
    setShow(true);
  }, [monster.id, ttsEnabled, sfxEnabled, defaultMode]);

  const meaningsComp = useMemo(
    () => <Meanings key={monster.id} meanings={meanings} />,
    [monster.id],
  );

  const sentenceSize = sentence.length > 80 ? "0.9em" : undefined;

  const statusBarM = useMemo(
    () => (
      <StatusBar session={session} showXP={showXP} style={statusBarStyle} />
    ),
    [session, showXP],
  );
  const monsterM = useMemo(
    () => (
      <MonsterCard
        monster={monster}
        sentence={sentence}
        meanings={defaultMode ? undefined : meaningsComp}
      />
    ),
    [monster.id],
  );

  const setOpen = useCallback(
    (show: boolean) => {
      if (show) {
        setShowingResults(!!modal);
        setModal(modal);
      } else if (modal && "next" in modal) {
        setShowingResults(!!modal.next);
        setModal(modal.next);
      } else {
        setShowingResults(false);
        setModal(null);
      }
    },
    [modal],
  );

  return (
    <>
      <ModalContext.Provider value={{ isOpen: !!modal, setOpen }}>
        {modal === null ? null : modal.type === "levelUp" ? (
          <LevelUpModal level={modal.newLevel} energy={modal.newEnergy} />
        ) : modal.type === "results" ? (
          <ResultsModal
            time={modal.time}
            xp={modal.xp}
            accuracy={modal.accuracy}
          />
        ) : null}
      </ModalContext.Provider>

      <div style={{ textAlign: "center" }}>
        {statusBarM}
        {pendingCount > 0 && (
          <>
            <div
              style={{
                padding: "0.5em 0.3em 0.3em 0.3em",
                marginBottom: "6em",
              }}
            >
              {monsterM}
              {show && (
                <>
                  <div style={{ paddingTop: "0.5em", paddingBottom: "0.5em" }}>
                    <span style={{ fontSize: "1.5em" }}>↓</span>
                  </div>
                  {defaultMode ? (
                    meaningsComp
                  ) : (
                    <div
                      className="selectable"
                      style={{ fontSize: sentenceSize }}
                    >
                      {sentence}
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              style={{
                position: "fixed",
                bottom: "0",
                width: "100%",
                backgroundColor: "black",
              }}
            >
              {show ? (
                <>
                  <p style={{ fontSize: "0.8em" }}>{_("Did you know it?")}</p>
                  <button
                    style={{ ...baseBtn, background: RED }}
                    onClick={onFailed}
                  >
                    <PixelThumbsdownSolid />
                  </button>
                  <button
                    style={{ ...baseBtn, background: MAIN_COLOR }}
                    onClick={onCorrect}
                  >
                    <PixelThumbsupSolid />
                  </button>
                </>
              ) : (
                <button
                  onClick={onShow}
                  style={{
                    ...baseBtn,
                    background: "#32526d",
                    width: "100%",
                  }}
                >
                  {_("Reveal")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

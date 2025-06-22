import { useState, useEffect, useMemo, useCallback } from "react";

import { MAIN_COLOR, RED } from "~/lib/constants";
import { _ } from "~/lib/lang";
import { getMode, getTTSEnabled, getSFXEnabled } from "~/lib/storage";
import { successSfx, errorSfx, clickSfx } from "~/lib/sounds";
import { getCard, sendMonsterUpdate } from "~/lib/game";
import { tts } from "~/lib/tts";

import MonsterCard from "~/components/MonsterCard";
import Meanings from "~/components/Meanings";
import StatusBar from "~/components/StatusBar";
import TextIcon from "~/components/icons/TextIcon";
import PixelatedImgIcon from "~/components/icons/PixelatedImgIcon";

import checkmarkURL from "@img/checkmark.png";

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
  showingResults: boolean;
  showXP: boolean;
  session: Session;
}

export default function GameSession({
  showingResults,
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
      showingResults={showingResults}
      showXP={showXP}
      session={session}
      monster={monster}
    />
  );
}

function Quiz({
  showingResults,
  showXP,
  session,
  monster,
}: Props & { monster: Monster }) {
  const [show, setShow] = useState(false);

  const defaultMode = getMode();
  const ttsEnabled = getTTSEnabled();
  const sfxEnabled = getSFXEnabled();
  const { sentence, meanings } = getCard(monster.id);

  const onFailed = useCallback(() => {
    setShow(false);
    const ttsWillSpeak = ttsEnabled && defaultMode;
    if (sfxEnabled && !ttsWillSpeak) errorSfx.play();
    sendMonsterUpdate(monster, false);
  }, [monster, ttsEnabled, sfxEnabled, defaultMode]);
  const onCorrect = useCallback(() => {
    const sessionFinished =
      session.failed.length + session.pending.length === 1;
    const ttsWillSpeak = ttsEnabled && defaultMode;
    if (sfxEnabled && (!ttsWillSpeak || sessionFinished)) {
      successSfx.play();
    }
    sendMonsterUpdate(monster, true);
  }, [monster, ttsEnabled, sfxEnabled, defaultMode]);
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

  useEffect(() => {
    if (ttsEnabled && defaultMode && !showingResults) tts(sentence);
  }, [monster]);

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

  return (
    <div style={{ textAlign: "center" }}>
      {statusBarM}
      <div style={{ padding: "0.5em 0.3em 0.3em 0.3em", marginBottom: "6em" }}>
        {monsterM}
        {show && (
          <>
            <div style={{ paddingTop: "0.5em", paddingBottom: "0.5em" }}>
              <span style={{ fontSize: "1.5em" }}>↓</span>
            </div>
            {defaultMode ? (
              meaningsComp
            ) : (
              <div className="selectable" style={{ fontSize: sentenceSize }}>
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
            <button style={{ ...baseBtn, background: RED }} onClick={onFailed}>
              <TextIcon text="X" />
            </button>
            <button
              style={{ ...baseBtn, background: MAIN_COLOR }}
              onClick={onCorrect}
            >
              <PixelatedImgIcon
                src={checkmarkURL}
                style={{ height: "1em", width: "auto" }}
              />
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
    </div>
  );
}

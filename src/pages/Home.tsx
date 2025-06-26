import { useState, useCallback } from "react";
import PixelPlaySolid from "~icons/pixel/play-solid";
import PixelCrownSolid from "~icons/pixel/crown-solid";
import PixelFireSolid from "~icons/pixel/fire-solid";
import PixelBoltSolid from "~icons/pixel/bolt-solid";
import PixelSparklesSolid from "~icons/pixel/sparkles-solid";

import { MAIN_COLOR, GOLDEN, BLUE, YELLOW } from "~/lib/constants";
import { _ } from "~/lib/i18n";
import { getLastPlayed, getShowIntro } from "~/lib/storage";

import { ModalContext } from "~/components/modals/Modal";
import NoEnergyModal from "~/components/modals/NoEnergyModal";
import IntroModal from "~/components/modals/IntroModal";
import GameModeModal from "~/components/modals/GameModeModal";
import PixelatedProgressBar from "~/components/PixelatedProgressBar";
import StatSection from "~/components/StatSection";
import TitleBar from "~/components/TitleBar";
import MenuButton from "~/components/MenuButton";

const card = {
  display: "flex",
  flexDirection: "column" as "column",
  border: "1px solid #464646",
  borderRadius: "5px",
  padding: "10px",
};

interface Props {
  player: Player;
}

export default function Home({ player }: Props) {
  const [modal, setModal] = useState(
    (getShowIntro() ? "intro" : null) as "intro" | "noEnergy" | "play" | null,
  );
  const today = new Date().setHours(0, 0, 0, 0);
  const lastPlayed = getLastPlayed();
  const epicStreak = player.streak >= 7;
  const streakColor =
    lastPlayed === today ? (epicStreak ? GOLDEN : MAIN_COLOR) : "#a8a8a8";
  const streakSize = player.streak > 999 ? "0.9em" : undefined;
  const toReviewColor = player.toReview ? undefined : MAIN_COLOR;

  const maxSeenRank = player.seen === player.total;
  const seenProgress = maxSeenRank ? 100 : player.seen % 100;
  const seenRankColor = maxSeenRank ? MAIN_COLOR : undefined;
  const maxMasteredRank = player.mastered === player.total;
  const masteredProgress = maxMasteredRank ? 100 : player.mastered % 100;
  const masteredRankColor = maxMasteredRank ? GOLDEN : undefined;

  const onPlay = useCallback(() => setModal("play"), []);
  const setOpen = useCallback(
    (show: boolean) => (show ? setModal(modal) : setModal(null)),
    [modal],
  );
  const onNoEnergy = useCallback(() => setModal("noEnergy"), []);

  return (
    <>
      <ModalContext.Provider value={{ isOpen: !!modal, setOpen }}>
        {modal === "intro" ? (
          <IntroModal />
        ) : modal === "noEnergy" ? (
          <NoEnergyModal />
        ) : modal === "play" ? (
          <GameModeModal
            energy={player.energy}
            onNoEnergy={onNoEnergy}
            style={{ minWidth: "60vw" }}
          />
        ) : null}
      </ModalContext.Provider>
      <TitleBar />
      <div style={{ padding: "0.5em" }}>
        <div style={{ ...card, marginBottom: "1em" }}>
          <StatSection
            title={_("LEVEL")}
            number={player.lvl}
            style={{ paddingBottom: "1em" }}
          />
          <div style={{ paddingBottom: "0.5em" }}>
            <PixelSparklesSolid
              style={{
                float: "left",
                paddingRight: "0.5em",
              }}
            />
            <PixelatedProgressBar
              progress={player.totalXp ? player.xp : 100}
              total={player.totalXp || 100}
              color={BLUE}
              label={
                player.totalXp ? `${player.xp}/${player.totalXp}` : _("MAX")
              }
            />
          </div>

          <div style={{ marginBottom: "1em" }}>
            <PixelBoltSolid
              style={{
                float: "left",
                paddingRight: "0.5em",
              }}
            />
            <PixelatedProgressBar
              progress={player.energy}
              total={player.maxEnergy}
              color={YELLOW}
              label={`${player.energy}/${player.maxEnergy}`}
            />
          </div>

          <StatSection
            title={_("STREAK:")}
            number={player.streak}
            numberSize={streakSize}
            numberColor={streakColor}
            unit={_(player.streak === 1 ? "day" : "days")}
            style={{ paddingBottom: "1em" }}
            icon={<PixelFireSolid style={{ color: streakColor }} />}
          />
          <StatSection
            title={_("PLAYED:")}
            number={player.studiedToday}
            unit={_("today")}
            style={{ paddingBottom: "1em" }}
          />
          <StatSection
            title={_("REVIEW:")}
            number={player.toReview}
            numberColor={toReviewColor}
          />
        </div>
        <div style={card}>
          <div style={{ paddingTop: "0.5em", paddingBottom: "1em" }}>
            <div style={{ paddingBottom: "0.3em" }}>
              {_("Discovered:")}
              <span style={{ display: "inline", float: "right" }}>
                <PixelCrownSolid
                  style={{ color: MAIN_COLOR, marginRight: "0.2em" }}
                />
                <span style={{ color: seenRankColor }}>
                  {Math.floor(player.seen / 100)}
                </span>
              </span>
            </div>
            <PixelatedProgressBar
              progress={seenProgress}
              total={100}
              color={MAIN_COLOR}
              label={`${seenProgress}/100`}
            />
          </div>
          <div style={{ paddingBottom: "0.5em" }}>
            <div style={{ paddingBottom: "0.3em" }}>
              {_("Mastered:")}
              <span style={{ display: "inline", float: "right" }}>
                <PixelCrownSolid
                  style={{ color: GOLDEN, marginRight: "0.2em" }}
                />
                <span style={{ color: masteredRankColor }}>
                  {Math.floor(player.mastered / 100)}
                </span>
              </span>
            </div>
            <PixelatedProgressBar
              progress={masteredProgress}
              total={100}
              color={GOLDEN}
              label={`${masteredProgress}/100`}
            />
          </div>
        </div>
        <MenuButton
          style={{
            fontSize: "1.5em",
            color: "black",
            background: MAIN_COLOR,
            padding: "0.6em 0.5em",
            marginTop: "1em",
          }}
          onClick={onPlay}
        >
          <PixelPlaySolid />
        </MenuButton>
      </div>
    </>
  );
}

import { MAIN_COLOR, RED, MAX_LEVEL } from "~/lib/constants";
import { _ } from "~/lib/lang";
import { getLastPlayed } from "~/lib/storage";
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
  onPlay: () => void;
  player: Player;
  onShowSettings: () => void;
}

export default function Home({ onPlay, player, onShowSettings }: Props) {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastPlayed = getLastPlayed();
  const streakColor = lastPlayed === today ? MAIN_COLOR : undefined;
  const streakSize = player.streak > 9999 ? "0.9em" : undefined;
  const toReviewColor = player.toReview ? undefined : MAIN_COLOR;
  const energyColor = player.energy < 10 ? RED : undefined;

  const missingXp = player.totalXp - player.xp;
  const xp = player.lvl === MAX_LEVEL ? _("MAX") : missingXp;
  const xpColor = player.lvl === MAX_LEVEL ? MAIN_COLOR : undefined;
  const xpSize =
    missingXp > 999999 ? "0.8em" : missingXp > 99999 ? "0.9em" : undefined;
  const xpUnit = player.lvl === MAX_LEVEL ? undefined : _("xp");

  const maxSeenRank = player.seen === player.total;
  const seenProgress = maxSeenRank ? 100 : player.seen % 100;
  const seenRankColor = maxSeenRank ? MAIN_COLOR : undefined;
  const maxMasteredRank = player.mastered === player.total;
  const masteredProgress = maxMasteredRank ? 100 : player.mastered % 100;
  const masteredRankColor = maxMasteredRank ? MAIN_COLOR : undefined;

  return (
    <>
      <TitleBar onShowSettings={onShowSettings} />
      <div style={{ padding: "0.5em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            paddingBottom: "1em",
          }}
        >
          <div style={{ ...card, width: "50%", marginRight: "0.2em" }}>
            <StatSection
              title={_("LEVEL")}
              number={player.lvl}
              style={{ paddingBottom: "1em" }}
            />
            <StatSection
              title={_("NEXT")}
              number={xp}
              numberSize={xpSize}
              numberColor={xpColor}
              unit={xpUnit}
              style={{ paddingBottom: "1em" }}
            />
            <StatSection
              title={_("ENERGY")}
              number={player.energy}
              numberColor={energyColor}
              unit={`/${player.maxEnergy}`}
            />
          </div>
          <div style={{ ...card, width: "50%" }}>
            <StatSection
              title={_("STREAK")}
              number={player.streak}
              numberSize={streakSize}
              numberColor={streakColor}
              unit={_(player.streak === 1 ? "day" : "days")}
              style={{ paddingBottom: "1em" }}
            />
            <StatSection
              title={_("PLAYED")}
              number={player.studiedToday}
              unit={_("today")}
              style={{ paddingBottom: "1em" }}
            />
            <StatSection
              title={_("REVIEW")}
              number={player.toReview}
              numberColor={toReviewColor}
            />
          </div>
        </div>
        <div style={card}>
          <div style={{ paddingTop: "0.5em", paddingBottom: "1em" }}>
            <div style={{ paddingBottom: "0.3em" }}>{_("Discovered:")}</div>
            <div style={{ paddingBottom: "0.3em" }}>
              {seenProgress}/100
              <span style={{ display: "inline", float: "right" }}>
                {_("RANK:")}
                <span style={{ color: seenRankColor }}>
                  {Math.floor(player.seen / 100)}
                </span>
              </span>
            </div>
            <PixelatedProgressBar
              progress={seenProgress}
              total={100}
              color={"#92c81a"}
              colorDiag1={"#7bc415"}
              colorDiag2={"#74b215"}
              colorDiag3={"#2c341c"}
            />
          </div>
          <div style={{ paddingBottom: "0.5em" }}>
            <div style={{ paddingBottom: "0.2em" }}>{_("Mastered:")}</div>
            <div style={{ paddingBottom: "0.3em" }}>
              {masteredProgress}/100
              <span style={{ display: "inline", float: "right" }}>
                {_("RANK:")}
                <span style={{ color: masteredRankColor }}>
                  {Math.floor(player.mastered / 100)}
                </span>
              </span>
            </div>
            <PixelatedProgressBar
              progress={masteredProgress}
              total={100}
              color={"#efb60e"}
              colorDiag1={"#e3ad0e"}
              colorDiag2={"#d09f0d"}
              colorDiag3={"#423204"}
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
          {_("Play")}
        </MenuButton>
      </div>
    </>
  );
}

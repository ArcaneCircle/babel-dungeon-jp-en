import PixelThumbsupSolid from "~icons/pixel/thumbsup-solid";
import PixelThumbsdownSolid from "~icons/pixel/thumbsdown-solid";
import PixelFaceThinkingSolid from "~icons/pixel/face-thinking-solid";
import PixelSparklesSolid from "~icons/pixel/sparkles-solid";

import { MAIN_COLOR, RED, GOLDEN } from "~/lib/constants";
import { _ } from "~/lib/i18n";

import BasicProgressBar from "./BasicProgressBar";

interface Props {
  showXP: boolean;
  session: Session;
  [key: string]: any;
}

const AlignedSpan = ({ children }: { children: React.ReactNode }) => (
  <span style={{ alignContent: "end" }}>{children}</span>
);

export default function StatusBar({ showXP, session, ...props }: Props) {
  const total =
    session.correct.length + session.failed.length + session.pending.length;

  return (
    <div {...props}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0.5em 1em",
        }}
      >
        {showXP && (
          <AlignedSpan>
            +{session.xp}
            <PixelSparklesSolid />
          </AlignedSpan>
        )}
        <AlignedSpan>
          <PixelThumbsupSolid
            style={{ color: MAIN_COLOR, marginRight: "0.2em" }}
          />
          {session.correct.length}
        </AlignedSpan>
        <AlignedSpan>
          <PixelThumbsdownSolid style={{ color: RED, marginRight: "0.2em" }} />
          {session.failed.length}
        </AlignedSpan>
        <AlignedSpan>
          <PixelFaceThinkingSolid
            style={{ color: GOLDEN, marginRight: "0.2em" }}
          />
          {session.pending.length}
        </AlignedSpan>
      </div>
      <BasicProgressBar progress={session.correct.length} total={total} />
    </div>
  );
}

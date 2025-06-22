import { RED } from "~/lib/constants";
import { _ } from "~/lib/lang";

import BasicProgressBar from "./BasicProgressBar";
import TextIcon from "~/components/icons/TextIcon";
import PixelatedImgIcon from "~/components/icons/PixelatedImgIcon";

import checkmarkGreenURL from "@img/checkmark-green.png";

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
            {_("+{{x}}xp").replace("{{x}}", String(session.xp))}
          </AlignedSpan>
        )}
        <AlignedSpan>
          <PixelatedImgIcon
            src={checkmarkGreenURL}
            style={{ height: "1.3em", width: "auto", marginRight: "0.2em" }}
          />
          {session.correct.length}
        </AlignedSpan>
        <AlignedSpan>
          <TextIcon
            style={{ color: RED, fontSize: "1.1em", marginRight: "0.2em" }}
            text="X"
          />
          {session.failed.length}
        </AlignedSpan>
        <AlignedSpan>
          <TextIcon
            style={{
              color: "#efb60e",
              fontSize: "1.1em",
              marginRight: "0.2em",
            }}
            text="?"
          />
          {session.pending.length}
        </AlignedSpan>
      </div>
      <BasicProgressBar progress={session.correct.length} total={total} />
    </div>
  );
}

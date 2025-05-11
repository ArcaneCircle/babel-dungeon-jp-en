import { MAIN_COLOR, MASTERED_STREAK } from "~/lib/constants";
import { _ } from "~/lib/util";

import MonsterImg from "~/components/MonsterImg";

interface Props {
  monster: Monster;
  sentence: string;
  meanings?: React.ReactNode;
}

export default function MonsterCard({ monster, sentence, meanings }: Props) {
  const label = monster.seen
    ? _("lvl.{{l}}").replace("{{l}}", String(monster.streak + 1))
    : _("NEW");
  const labelColor =
    monster.streak >= MASTERED_STREAK
      ? "#efb60e"
      : monster.seen
        ? "#dddddd"
        : MAIN_COLOR;
  const labelStyle = {
    color: labelColor,
    background: "none",
    borderRadius: "5px",
    border: "1px solid " + labelColor,
    padding: "0.3em",
    fontWeight: "bold",
    fontSize: "0.9em",
  };
  const fontSize = sentence.length > 80 ? "0.9em" : undefined;

  return (
    <div>
      <MonsterImg
        value={sentence}
        width={80}
        height={80}
        style={{ marginBottom: "0.5em" }}
      />
      <div style={{ marginBottom: "0.8em" }}>
        <span style={labelStyle}>{label}</span>
      </div>
      {meanings ? (
        meanings
      ) : (
        <div className="selectable" style={{ fontSize }}>
          {sentence}
        </div>
      )}
    </div>
  );
}

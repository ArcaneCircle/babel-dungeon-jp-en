import { clickSfx } from "~/lib/sounds";
import { getSFXEnabled } from "~/lib/storage";
import { BG_SECONDARY, TEXT_PRIMARY } from "~/lib/theme";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  [key: string]: any;
}

export default function MenuButton({ onClick, children, ...props }: Props) {
  const btnStyle = {
    width: "100%",
    fontSize: "1em",
    color: TEXT_PRIMARY,
    backgroundColor: BG_SECONDARY,
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    padding: "0.5em",
  };
  props.style = { ...btnStyle, ...(props.style || {}) };
  const clickWithSound = () => {
    if (getSFXEnabled()) clickSfx.play();
    onClick();
  };

  return (
    <button onClick={clickWithSound} {...props}>
      {children}
    </button>
  );
}

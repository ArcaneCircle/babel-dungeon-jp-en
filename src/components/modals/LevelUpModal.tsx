import { useEffect } from "react";

import { _ } from "~/lib/lang";
import { levelUpSfx, successSfx } from "~/lib/sounds";
import { getSFXEnabled } from "~/lib/storage";

import PixelatedImgIcon from "~/components/icons/PixelatedImgIcon";
import ConfirmModal from "./ConfirmModal";

import partyPopperURL from "@img/party-popper.png";

type Props = {
  level: number;
  energy: number;
  onClose: () => void;
  isOpen: boolean;
  [key: string]: any;
};

export default function LevelUpModal({ level, energy, ...props }: Props) {
  useEffect(() => {
    if (getSFXEnabled()) {
      successSfx.stop(); // avoid mixed sounds
      levelUpSfx.play();
    }
  }, [level]);

  const PartyPopper = () => (
    <PixelatedImgIcon
      src={partyPopperURL}
      style={{ height: "1.3em", width: "auto" }}
    />
  );
  return (
    <ConfirmModal {...props}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "2em" }}>
          {_("You Leveled Up!")}
          <hr />
        </div>
        <div style={{ fontSize: "0.8em", paddingBottom: "0.4em" }}>
          {_("Now at level")}
        </div>
        <div style={{ fontSize: "1.5em" }}>
          <PartyPopper />
          <span style={{ paddingLeft: "0.2em", paddingRight: "0.2em" }}>
            {level}
          </span>
          <PartyPopper />
        </div>
        {energy > 0 && (
          <div style={{ marginTop: "1em" }}>
            {_("+{{x}} max. energy").replace("{{x}}", String(energy))}
          </div>
        )}
      </div>
    </ConfirmModal>
  );
}

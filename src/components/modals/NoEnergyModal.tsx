import { PLAY_ENERGY_COST } from "~/lib/constants";
import { _ } from "~/lib/lang";

import ConfirmModal from "./ConfirmModal";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  [key: string]: any;
};

export default function NoEnergyModal(props: Props) {
  return (
    <ConfirmModal {...props}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "2em" }}>
          {_("LOW ENERGY!")}
          <hr />
        </div>
        <p>
          {_(
            "Your energy is too low. You need at least {{e}} points to play.",
          ).replace("{{e}}", String(PLAY_ENERGY_COST))}
        </p>
        <p>
          {_(
            "You will recover energy over time. Take a break and come back later!",
          )}
        </p>
      </div>
    </ConfirmModal>
  );
}

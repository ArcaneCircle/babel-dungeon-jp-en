import { _ } from "~/lib/i18n";

import ConfirmModal from "./ConfirmModal";

type Props = {
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
        <p>{_("Your energy is too low.")}</p>
        <p>
          {_(
            "You will recover energy over time. Take a break and come back later!",
          )}
        </p>
      </div>
    </ConfirmModal>
  );
}

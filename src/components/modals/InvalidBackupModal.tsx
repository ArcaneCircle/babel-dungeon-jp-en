import { _ } from "~/lib/util";

import ConfirmModal from "./ConfirmModal";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  [key: string]: any;
};

export default function InvalidBackupModal(props: Props) {
  return (
    <ConfirmModal {...props}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "2em" }}>
          {_("ERROR")}
          <hr />
        </div>
        <p>
          {_(
            "Can't import backup, it is not compatible with your version of the game",
          )}
        </p>
      </div>
    </ConfirmModal>
  );
}

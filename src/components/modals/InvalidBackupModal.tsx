import { _ } from "~/lib/i18n";

import ConfirmModal from "./ConfirmModal";

type Props = {
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

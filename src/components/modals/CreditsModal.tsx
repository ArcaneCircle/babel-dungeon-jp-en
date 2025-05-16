import { _ } from "~/lib/util";

import ConfirmModal from "./ConfirmModal";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  [key: string]: any;
};

export default function CreditsModal(props: Props) {
  return (
    <ConfirmModal {...props}>
      <div className="selectable" style={{ textAlign: "center" }} tabIndex={1}>
        <div style={{ marginBottom: "2em" }}>
          {_("CREDITS")}
          <hr />
        </div>
        <div style={{ fontSize: "0.9em" }}>
          <p>{_("Developer: Asiel Diaz Benitez")}</p>
          <p>{_("Sentences collection: tatoeba.org")}</p>
          <p>{_(`Music: "Cave" by celestialghost8`)}</p>
          <p>{_("Sound effects by celestialghost8, Fupi and Dizzy Crow")}</p>
          <p>{_("More details at: github.com/ArcaneCircle/babel-dungeon")}</p>
        </div>
      </div>
    </ConfirmModal>
  );
}

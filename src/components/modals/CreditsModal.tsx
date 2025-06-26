import { LANG1_CODE, LANG2_CODE } from "~/lib/constants";
import { _ } from "~/lib/i18n";

import ConfirmModal from "./ConfirmModal";

type Props = {
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
          <p>{_("Developer: Asiel Diaz Benitez (adb)")}</p>
          <p>{_("Sentences collection: tatoeba.org")}</p>
          <p>{_('UI Icons: "Pixel Icon" by HackerNoon')}</p>
          <p>{_("Sound effects by celestialghost8, Fupi and Dizzy Crow")}</p>
          <p>{_("Translators: adb, sbkaf")}</p>
          <p>
            {_(
              "More details at: github.com/ArcaneCircle/babel-dungeon-{{l1}}-{{l2}}",
            )
              .replace("{{l1}}", LANG1_CODE)
              .replace("{{l2}}", LANG2_CODE)}
          </p>
        </div>
      </div>
    </ConfirmModal>
  );
}

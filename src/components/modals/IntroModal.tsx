import { _ } from "~/lib/i18n";

import ConfirmModal from "./ConfirmModal";

type Props = {
  [key: string]: any;
};

export default function IntroModal(props: Props) {
  return (
    <ConfirmModal {...props}>
      <div
        className="selectable"
        style={{ textAlign: "center", fontSize: "0.9em" }}
        tabIndex={1}
      >
        <div style={{ marginBottom: "2em" }}>
          {_("Welcome to Babel Dungeon!")}
        </div>
        <p>
          {_(
            "Looking for a shortcut to learning another language you entered the Babel Dungeon, but to your surprise, instead of answers, all you found was weird creatures creeping in the darkness.",
          )}
        </p>
        <p>
          {_(
            "They look weak but you realized that by solving their linguistic riddles, they become stronger!",
          )}
        </p>
        <p>
          {_(
            "Adapting to the circumstances, you decided to train them and build your own army of minions to, one day, get out of the dungeon and take over the world, thus banning any language you don't know.",
          )}
        </p>
      </div>
    </ConfirmModal>
  );
}

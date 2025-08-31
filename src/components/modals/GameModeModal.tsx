import { useCallback } from "react";
import PixelBoltSolid from "~icons/pixel/bolt-solid";

import { _ } from "~/lib/i18n";
import { PLAY_ENERGY_COST, RED } from "~/lib/constants";
import { startNewGame } from "~/lib/game";

import ConfirmModal from "~/components/modals/ConfirmModal";
import MenuPreference from "~/components/MenuPreference";

function MenuItem({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: "1em" }}>{children}</div>;
}

type Props = {
  player: Player;
  onNoEnergy: () => void;
  [key: string]: any;
};

export default function GameModeModal({ player, onNoEnergy, ...props }: Props) {
  const energyCost =
    player.toReview > 0 ? PLAY_ENERGY_COST / 2 : PLAY_ENERGY_COST;
  const energyCostHard = Math.floor(energyCost / 2);
  const playEasy = useCallback(() => {
    if (!startNewGame("easy", energyCost)) {
      onNoEnergy();
    }
  }, [energyCost, onNoEnergy]);
  const playHard = useCallback(() => {
    if (!startNewGame("hard", energyCostHard)) {
      onNoEnergy();
    }
  }, [energyCostHard, onNoEnergy]);

  const easyColor = player.energy < energyCost ? RED : undefined;
  const hardColor = player.energy < energyCostHard ? RED : undefined;

  return (
    <ConfirmModal buttonText={_("Cancel")} {...props}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "2em" }}>
          {_("GAME MODE")}
          <hr />
        </div>
        <MenuItem>
          <MenuPreference
            name={_("Easy")}
            state={
              <div style={{ color: easyColor }}>
                {`${-energyCost}`}
                <PixelBoltSolid />
              </div>
            }
            onClick={playEasy}
          />
        </MenuItem>
        <MenuItem>
          <MenuPreference
            name={_("Hard")}
            state={
              <div style={{ color: hardColor }}>
                {`${-energyCostHard}`}
                <PixelBoltSolid />
              </div>
            }
            onClick={playHard}
          />
        </MenuItem>
      </div>
    </ConfirmModal>
  );
}

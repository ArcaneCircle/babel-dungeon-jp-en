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
  energy: number;
  onNoEnergy: (cost: number) => void;
  [key: string]: any;
};

export default function GameModeModal({ energy, onNoEnergy, ...props }: Props) {
  const energyCostHard = Math.floor(PLAY_ENERGY_COST / 2);
  const playEasy = useCallback(() => {
    if (energy >= PLAY_ENERGY_COST) {
      startNewGame("easy");
    } else {
      onNoEnergy(PLAY_ENERGY_COST);
    }
  }, [energy, onNoEnergy]);
  const playHard = useCallback(() => {
    if (energy >= energyCostHard) {
      startNewGame("hard");
    } else {
      onNoEnergy(energyCostHard);
    }
  }, [energy, onNoEnergy]);

  const easyColor = energy < PLAY_ENERGY_COST ? RED : undefined;
  const hardColor = energy < energyCostHard ? RED : undefined;

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
                {`-${PLAY_ENERGY_COST}`}
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
                {`-${energyCostHard}`}
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

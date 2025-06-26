import { useState, useCallback } from "react";
import PixelCogSolid from "~icons/pixel/cog-solid";

import { getSFXEnabled } from "~/lib/storage";
import { clickSfx } from "~/lib/sounds";

import { ModalContext } from "~/components/modals/Modal";
import SettingsModal from "~/components/modals/SettingsModal";
import CreditsModal from "~/components/modals/CreditsModal";
import InvalidBackupModal from "~/components/modals/InvalidBackupModal";

const containerStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#313131",
};
const settingsStyle = {
  padding: "0.5em",
  fontSize: "1.4em",
  cursor: "pointer",
};

export default function TitleBar() {
  const [modal, setModal] = useState(
    null as "settings" | "credits" | "invalidBackup" | null,
  );
  const onShowSettings = useCallback(() => {
    if (getSFXEnabled()) clickSfx.play();
    setModal("settings");
  }, []);
  const setOpen = useCallback(
    (show: boolean) => (show ? setModal(modal) : setModal(null)),
    [modal],
  );

  return (
    <>
      <ModalContext.Provider value={{ isOpen: !!modal, setOpen }}>
        {modal === "settings" ? (
          <SettingsModal
            onImportBackupFailed={() => setModal("invalidBackup")}
            onShowCredits={() => setModal("credits")}
          />
        ) : modal === "credits" ? (
          <CreditsModal />
        ) : (
          <InvalidBackupModal />
        )}
      </ModalContext.Provider>
      <div style={containerStyle}>
        <div style={{ paddingLeft: "1em" }}>Babel Dungeon</div>
        <PixelCogSolid style={settingsStyle} onClick={onShowSettings} />
      </div>
    </>
  );
}

import { useState, useCallback } from "react";
import { LANG1_NAME, LANG2_NAME } from "~/lib/constants";
import { TEXT_SECONDARY } from "~/lib/theme";
import { _ } from "~/lib/i18n";
import { importGame, selectLanguage } from "~/lib/game";

import MenuButton from "~/components/MenuButton";
import { ModalContext } from "~/components/modals/Modal";
import InvalidBackupModal from "~/components/modals/InvalidBackupModal";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: "0 2em",
  gap: "2em",
};

const titleStyle = {
  fontSize: "2em",
  textAlign: "center" as "center",
  marginBottom: "1em",
};

const buttonContainerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "1em",
  width: "100%",
  maxWidth: "400px",
};

const buttonStyle = {
  fontSize: "1.2em",
  padding: "1em 2em",
};

const versionStyle = {
  position: "fixed" as "fixed",
  bottom: "1em",
  right: "1em",
  fontSize: "0.75rem",
  color: TEXT_SECONDARY,
};

export default function Welcome() {
  const [stage, setStage] = useState<"initial" | "language">("initial");
  const [showInvalidBackup, setShowInvalidBackup] = useState(false);

  const onNewGame = useCallback(() => {
    setStage("language");
  }, []);

  const onImportGame = useCallback(async () => {
    const [file] = await window.webxdc.importFiles({ extensions: [".bak"] });
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        if (!importGame(e.target.result as string)) {
          setShowInvalidBackup(true);
        }
      }
    };
    reader.readAsText(file, "UTF-8");
  }, []);

  const setOpen = useCallback((show: boolean) => {
    if (!show) setShowInvalidBackup(false);
  }, []);

  return (
    <>
      <ModalContext.Provider value={{ isOpen: showInvalidBackup, setOpen }}>
        {showInvalidBackup && <InvalidBackupModal />}
      </ModalContext.Provider>
      <div style={containerStyle}>
        {stage === "initial" ? (
          <>
            <img src="icon.png" style={{ width: "8em" }} />
            <div style={titleStyle}>Babel Dungeon</div>

            <div style={buttonContainerStyle}>
              <MenuButton style={buttonStyle} onClick={onNewGame}>
                {_("New Game")}
              </MenuButton>
              <MenuButton style={buttonStyle} onClick={onImportGame}>
                {_("Import Game")}
              </MenuButton>
            </div>
            <span style={versionStyle}>{__APP_VERSION__}</span>
          </>
        ) : (
          <div style={buttonContainerStyle}>
            <div style={{ textAlign: "center", marginBottom: "1em" }}>
              {_("What language do you want to learn?")}
            </div>
            <MenuButton
              style={buttonStyle}
              onClick={() => selectLanguage("LANG1")}
            >
              {_(LANG1_NAME)}
            </MenuButton>
            <MenuButton
              style={buttonStyle}
              onClick={() => selectLanguage("LANG2")}
            >
              {_(LANG2_NAME)}
            </MenuButton>
          </div>
        )}
      </div>
    </>
  );
}

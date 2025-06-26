import { useContext } from "react";

import { MAIN_COLOR } from "~/lib/constants";
import { _ } from "~/lib/i18n";

import { ModalContext } from "~/components/modals/Modal";
import { Modal } from "~/components/modals/Modal";
import MenuButton from "~/components/MenuButton";

type Props = {
  buttonText?: string;
  children: React.ReactNode;
  [key: string]: any;
};

export default function ConfirmModal({
  buttonText,
  children,
  ...props
}: Props) {
  const { setOpen } = useContext(ModalContext);
  return (
    <Modal {...props}>
      <div>{children}</div>
      <MenuButton
        style={{
          color: "black",
          background: MAIN_COLOR,
          marginTop: "2em",
        }}
        onClick={() => setOpen(false)}
      >
        {buttonText || _("Continue")}
      </MenuButton>
    </Modal>
  );
}

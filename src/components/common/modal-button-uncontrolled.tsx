import { useState } from "react";
import { ModalButton, type ModalButtonProps } from "./modal-button";

export type ModalButtonUncontrolledProps = Omit<
  ModalButtonProps,
  "setShow" | "show"
>;

export function ModalButtonUncontrolled(props: ModalButtonUncontrolledProps) {
  const [show, setShow] = useState(false);

  return <ModalButton {...props} setShow={setShow} show={show} />;
}

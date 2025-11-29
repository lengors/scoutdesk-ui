import {
  Fragment,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  Button,
  Modal,
  type ButtonProps,
  type ModalProps,
} from "react-bootstrap";
import { ModalContext } from "../../contexts/modal-context";
import { ModalButtonUncontrolled } from "./modal-button-uncontrolled";

export type ModalButtonProps = Omit<
  ButtonProps,
  "as" | "children" | "onClick"
> & {
  readonly button?: (props: Omit<ButtonProps, "as">) => ReactNode;
  readonly children?: ReactNode;
  readonly modal?: (
    props: Pick<ModalProps, "children" | "onHide" | "show">,
  ) => ReactNode;
} & (
    | {
        readonly setShow: Dispatch<SetStateAction<boolean>>;
        readonly show: boolean;
      }
    | {
        readonly setShow?: never;
        readonly show?: never;
      }
  );

export function ModalButton({
  button: nullishButton,
  children,
  modal: nullishModal,
  setShow,
  show,
  ...props
}: ModalButtonProps) {
  const button =
    nullishButton ?? ((buttonProps) => <Button {...buttonProps} />);
  const modal =
    nullishModal ??
    ((modalProps: Parameters<Required<ModalButtonProps>["modal"]>[0]) => (
      <Modal {...modalProps} />
    ));

  if (setShow === undefined && show === undefined) {
    return (
      <ModalButtonUncontrolled {...props} button={button} modal={modal}>
        {children}
      </ModalButtonUncontrolled>
    );
  }

  return (
    <Fragment>
      {button({
        ...props,
        onClick: () => setShow(true),
      })}
      {modal({
        children: (
          <ModalContext.Provider value={[show, setShow]}>
            {children}
          </ModalContext.Provider>
        ),
        onHide: () => setShow(false),
        show,
      })}
    </Fragment>
  );
}

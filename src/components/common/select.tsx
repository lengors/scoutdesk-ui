import type { ButtonVariant } from "react-bootstrap/types";

import { useRectSize } from "../../hooks/use-rect-size";
import { OverlayTriggerTooltip } from "./overlay-trigger-tooltip";
import { Dropdown, Form, type FormControlProps } from "react-bootstrap";
import {
  forwardRef,
  useEffect,
  useMemo,
  type ComponentRef,
  type ComponentType,
  type Dispatch,
  type FC,
  type PropsWithoutRef,
  type ReactNode,
  type Ref,
  type RefAttributes,
  type SetStateAction,
} from "react";

export interface SelectProps<TOption>
  extends Omit<
    FormControlProps,
    | "as"
    | "children"
    | "disabled"
    | "onBlur"
    | "onChange"
    | "readOnly"
    | "type"
    | "value"
  > {
  readonly as?: ComponentType<
    PropsWithoutRef<Omit<FormControlProps, "as">> &
      RefAttributes<ComponentRef<"input">>
  >;
  readonly children?: ReactNode;
  readonly compareFn?: (
    optionValue: TOption,
    selectedValue: TOption,
  ) => boolean;
  readonly disabled?: boolean;
  readonly onBlur?: () => void;
  readonly onChange?: (value: TOption) => void;
  readonly onUpdate?: Dispatch<
    SetStateAction<string | number | string[] | undefined>
  >;
  readonly options: ReadonlyArray<{
    readonly key?: string;
    readonly label: string;
    readonly value: TOption;
  }>;
  readonly value: TOption;
  readonly variant?: ButtonVariant;
}

type ForwardRefSelectProps<TOption = unknown> = SelectProps<TOption> &
  RefAttributes<ComponentRef<"input">>;

interface ForwardRefSelectFC extends FC<ForwardRefSelectProps> {
  <TOption>(
    props: ForwardRefSelectProps<TOption>,
  ): ReturnType<FC<ForwardRefSelectProps<TOption>>>;
}

export const Select: ForwardRefSelectFC = forwardRef(
  <TOption,>(
    {
      as: As = Form.Control,
      children,
      compareFn = (optionValue, selectedValue) => optionValue === selectedValue,
      defaultValue,
      disabled,
      name,
      onBlur,
      onChange,
      onUpdate,
      options,
      value,
      variant,
      ...props
    }: SelectProps<TOption>,
    ref: Ref<ComponentRef<"input">>,
  ) => {
    const [controlRef, controlRect] = useRectSize<HTMLInputElement>();
    const [toggleRef, toggleRect] = useRectSize<HTMLButtonElement>();
    const selectWidth = useMemo(
      () => controlRect.width + toggleRect.width,
      [controlRect, toggleRect],
    );
    const presentableValue = useMemo(() => {
      const valueLabel = options.find(({ value: optionValue }) =>
        compareFn(optionValue, value),
      )?.label;
      if (valueLabel !== undefined) {
        return valueLabel;
      }

      return typeof defaultValue === "string" ||
        typeof defaultValue === "number" ||
        defaultValue === undefined
        ? (defaultValue ?? "")
        : [...defaultValue];
    }, [compareFn, defaultValue, options, value]);

    useEffect(() => onUpdate?.(presentableValue), [onUpdate, presentableValue]);

    return (
      <Dropdown align="end">
        <As
          {...props}
          disabled
          name={name}
          readOnly
          type="text"
          value={presentableValue}
          ref={(instance: HTMLInputElement | null) => {
            controlRef(instance);
            if (typeof ref === "function") {
              ref(instance);
            } else if (ref !== null) {
              ref.current = instance;
            }
          }}
        />

        <Dropdown.Toggle
          disabled={options.length === 0 || disabled === true}
          ref={toggleRef}
          split
          variant={variant}
        />

        <Dropdown.Menu
          onBlur={onBlur}
          style={{
            maxWidth: selectWidth,
            minWidth: selectWidth,
          }}
        >
          {children}
          {options.map(({ key, label, value }) => (
            <Dropdown.Item
              className="text-truncate"
              key={key}
              onClick={
                onChange !== undefined ? () => onChange(value) : undefined
              }
            >
              <OverlayTriggerTooltip
                tooltip={label}
                trigger={["focus", "hover"]}
              >
                <span>{label}</span>
              </OverlayTriggerTooltip>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
);

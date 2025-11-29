import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from "react-hook-form";
import {
  flattenFieldErrorTree,
  type FieldErrorTree,
} from "../../utils/field-error";
import { CopyButton } from "./copy-button";
import { TooltipButton } from "./tooltip-button";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { TooltipFormControl } from "./tooltip-form-control";
import { Form, InputGroup, type FormControlProps } from "react-bootstrap";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

export interface FieldControlledProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> extends Omit<
    FormControlProps,
    | "children"
    | "isInvalid"
    | "isValid"
    | "name"
    | "onBlur"
    | "onChange"
    | "readOnly"
    | "type"
    | "value"
  > {
  readonly control: Control<TFieldValues, unknown, TTransformedValues>;
  readonly label: string;
  readonly name: TName;
  readonly readOnly?: boolean;
  readonly type: [PathValue<TFieldValues, TName>] extends [FileList | File[]]
    ? "file"
    : [PathValue<TFieldValues, TName>] extends [string]
      ? "password" | "text"
      : never;
}

export function FieldControlled<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  control,
  disabled,
  label,
  name,
  type,
  ...props
}: FieldControlledProps<TFieldValues, TName, TTransformedValues>) {
  const {
    field: { disabled: fieldDisabled, value, ...fieldProps },
    fieldState: { error },
    formState: { isSubmitted, submitCount, errors },
  } = useController({ control, name });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState(error);
  const [fieldSubmitCount, setFieldSubmitCount] = useState(submitCount);

  const { onChange, ...field } = useMemo(
    () => ({
      ...fieldProps,
      disabled: disabled || fieldDisabled,
    }),
    [disabled, fieldDisabled, fieldProps],
  );
  const errorMessages = useMemo(
    () =>
      fieldError !== undefined
        ? flattenFieldErrorTree(fieldError as FieldErrorTree).map(
            ([message, key]) =>
              key === undefined ? message : `${key}: ${message}`,
          )
        : [],
    [fieldError],
  );

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const presentableValue = useMemo(
    () => (type !== "file" ? value : undefined),
    [type, value],
  );

  useEffect(() => {
    let input: HTMLInputElement | null;
    if (type !== "file" || (input = inputRef.current) === null) {
      return;
    }

    const inputDescriptor = Object.getOwnPropertyDescriptor(input, "files");
    const isWritable =
      inputDescriptor?.set !== undefined || inputDescriptor?.writable === true;
    if (!isWritable) {
      return;
    }

    const dataTransfer = new DataTransfer();
    const fieldValue = value as unknown;
    if (typeof fieldValue !== "object") {
      return;
    }

    if (fieldValue instanceof File) {
      dataTransfer.items.add(value);
    } else if (fieldValue instanceof FileList) {
      for (const file of fieldValue) {
        dataTransfer.items.add(file);
      }
    } else {
      return;
    }

    input.files = dataTransfer.files;
  }, [type, value]);

  if (fieldSubmitCount !== submitCount) {
    setFieldSubmitCount(submitCount);
    setFieldError(error);
  }

  return (
    <Form.Group>
      <Form.Label htmlFor={inputId}>{label}</Form.Label>
      <InputGroup hasValidation={isSubmitted}>
        <TooltipFormControl
          {...props}
          {...field}
          id={inputId}
          isInvalid={isSubmitted ? errorMessages.length > 0 : undefined}
          isValid={
            isSubmitted
              ? errorMessages.length === 0 && errors.root === undefined
              : undefined
          }
          onChange={
            type === "file"
              ? (event: ChangeEvent<HTMLInputElement>) =>
                  onChange(event.target.files)
              : onChange
          }
          ref={(value) => {
            inputRef.current = value;
            field.ref(value);
          }}
          tooltip={presentableValue}
          trigger={["focus", "hover"]}
          value={presentableValue}
          type={showPassword ? "text" : type}
        />
        {type === "password" && (
          <TooltipButton
            onClick={() => setShowPassword((previous) => !previous)}
            tooltip={showPassword ? "Hide password" : "Show password"}
            variant="outline-secondary"
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </TooltipButton>
        )}
        {presentableValue !== undefined && (
          <CopyButton value={presentableValue} variant="outline-secondary" />
        )}
        {isSubmitted &&
          (errorMessages.length > 0 || errors.root === undefined) && (
            <Form.Control.Feedback
              type={errorMessages.length > 0 ? "invalid" : "valid"}
            >
              {errorMessages.length > 0 ? (
                <ul className="mb-0">
                  {errorMessages.map((errorMessage, index) => (
                    <li key={index}>{errorMessage}</li>
                  ))}
                </ul>
              ) : (
                "Looks good!"
              )}
            </Form.Control.Feedback>
          )}
      </InputGroup>
    </Form.Group>
  );
}

import styled from "styled-components";
import { FormInputError } from "../formInputError/FormInputError";
import type { FormType } from "../flightFormModal/types";

interface Props {
  name: string;
  type: FormType;
  value: string | number;
  placeholder?: string;
  id: string;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleBlur?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  label: string;
  error?: string;
  touched?: boolean;
  options?: SelectOption[];
  hint?: string;
  disabled?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  flex: 1;
`;

const StyledLabel = styled.label`
  font-size: 13px;
  color: #162033;
  font-weight: 500;
`;

const baseInputStyles = `
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  color: #162033;
  font: inherit;
  font-size: 14px;
  font-weight: 400;

  &:focus-visible {
    outline: 2px solid #1b63d6;
    outline-offset: 1px;
  }
`;

const StyledInput = styled.input<{ $error: boolean }>`
  ${baseInputStyles}
  border: 1px solid ${(p) => (p.$error ? "#c0262d" : "#c9d2df")};
  background: ${(p) => (p.$error ? "#fff8f8" : "#fff")};

  &::placeholder {
    color: #566377;
    opacity: 0.8;
  }
  &:disabled {
    background: #f2f4f8;
    color: #566377;
    cursor: not-allowed;
  }
`;

const StyledSelect = styled.select`
  ${baseInputStyles}
  border: 1px solid #c9d2df;
  background: #fff;
`;

const HintBox = styled.span`
  color: #566377;
  font-size: 12px;
  font-weight: 400;
`;

export const FormInput: React.FunctionComponent<Props> = ({
  name,
  type,
  value,
  placeholder,
  id,
  label,
  handleChange,
  handleBlur,
  error,
  touched,
  options = [],
  hint,
  disabled,
}) => {
  const hasError = Boolean(touched && error);

  return (
    <Field>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>

      {type === "select" ? (
        <StyledSelect
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          id={id}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
      ) : (
        <StyledInput
          $error={hasError}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          id={id}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
      )}

      {touched && error ? (
        <FormInputError message={error} />
      ) : (
        hint && <HintBox>{hint}</HintBox>
      )}
    </Field>
  );
};

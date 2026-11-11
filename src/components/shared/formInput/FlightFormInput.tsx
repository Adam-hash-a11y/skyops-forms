import styled from "styled-components";
import { FormInputError } from "../formInputError/FormInputError";
import type { FormType } from "../flightFormModal/types";
import { theme } from "../../../theme/theme";

interface Props {
  name: string;
  type: FormType;
  value: string | number;
  placeholder?: string;
  id: string;
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleInputBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
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
  disabled?: boolean;
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  width: 100%;
  flex: 1;
`;

const StyledLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeights.medium};
`;

const baseInputStyles = `
  width: 100%;
  height: 36px;
  padding: 0 ${theme.spacing[12]};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.primary};
  font: inherit;
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.regular};

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary.main};
    outline-offset: 1px;
  }
`;

const StyledInput = styled.input<{ $error: boolean }>`
  ${baseInputStyles}
  border: 1px solid
    ${(p) =>
    p.$error ? theme.colors.status.error.main : theme.colors.border.dashed};
  background: ${(p) =>
    p.$error ? theme.colors.background.error : theme.colors.background.paper};

  &::placeholder {
    color: ${theme.colors.text.secondary};
    opacity: 0.8;
  }
  &:disabled {
    background: ${theme.colors.background.main};
    color: ${theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const StyledSelect = styled.select`
  ${baseInputStyles}
  border: 1px solid ${theme.colors.border.dashed};
  background: ${theme.colors.background.paper};

  &:disabled {
    background: ${theme.colors.background.main};
    color: ${theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const HintBox = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
`;

export const FormInput: React.FunctionComponent<Props> = ({
  name,
  type,
  value,
  placeholder,
  id,
  label,
  handleInputChange,
  handleSelectChange,
  handleInputBlur,
  handleSelectBlur,
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
          onChange={handleSelectChange}
          onBlur={handleSelectBlur}
          id={id}
          disabled={disabled}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
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
          onChange={handleInputChange}
          onBlur={handleInputBlur}
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

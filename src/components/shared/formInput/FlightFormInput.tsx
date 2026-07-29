import { FormType } from "../../flightForm/types";
import styled from "styled-components";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

interface Props {
  name: string;
  type: FormType;
  value: string | number;
  placeholder: string;
  id: string;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleBlur: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  label: string;
  error?: string;
  touched?: boolean;
}

function getVariant(touched?: boolean, error?: string) {
  if (!touched) return "neutral";
  if (error) return "error";
  return "success";
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const baseInputStyles = `
  width: 400px;
  padding: 11px 38px 11px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #1e1b2e;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
  }
`;

const NeutralInput = styled.input`
  ${baseInputStyles}
  border: 1px solid #e2e2ea;
  background: #ffffff;

  &:focus {
    border-color: #6d5ef8;
  }
`;

const ErrorInput = styled.input`
  ${baseInputStyles}
  border: 1px solid #dc2626;
  background: #fef2f2;
`;

const SuccessInput = styled.input`
  ${baseInputStyles}
  border: 1px solid #16a34a;
  background: #ffffff;
`;

const inputVariants = {
  neutral: NeutralInput,
  error: ErrorInput,
  success: SuccessInput,
};

const baseSelectStyles = `
  width: 400px;
  padding: 11px 38px 11px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #1e1b2e;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:focus {
    outline: none;
  }
`;

const NeutralSelect = styled.select`
  ${baseSelectStyles}
  border: 1px solid #e2e2ea;
  background: #ffffff;

  &:focus {
    border-color: #6d5ef8;
  }
`;

const ErrorSelect = styled.select`
  ${baseSelectStyles}
  border: 1px solid #dc2626;
  background: #fef2f2;
`;

const SuccessSelect = styled.select`
  ${baseSelectStyles}
  border: 1px solid #16a34a;
  background: #ffffff;
`;

const selectVariants = {
  neutral: NeutralSelect,
  error: ErrorSelect,
  success: SuccessSelect,
};

const SuccessIcon = styled(FaCircleCheck)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #16a34a;
  font-size: 16px;
`;

const ErrorIcon = styled(FaCircleExclamation)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #dc2626;
  font-size: 16px;
`;

const StyledLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #1e1b2e;
  margin-bottom: 6px;
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
}) => {
  const variant = getVariant(touched, error);
  const StyledInput = inputVariants[variant];
  const StyledSelect = selectVariants[variant];

  if (type == "select") {
    return (
      <Field>
        <StyledLabel htmlFor={id}>{label}</StyledLabel>
        <InputWrapper>
          <StyledSelect
            value={value}
            name={name}
            id={id}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="" disabled>
              --Select a status--
            </option>
            <option value="Scheduled">Scheduled</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Landed">Landed</option>
          </StyledSelect>
          {variant === "success" && <SuccessIcon aria-hidden="true" />}
          {variant === "error" && <ErrorIcon aria-hidden="true" />}
        </InputWrapper>
      </Field>
    );
  }

  return (
    <Field>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <InputWrapper>
        <StyledInput
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          id={id}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {variant === "success" && <SuccessIcon aria-hidden="true" />}
        {variant === "error" && <ErrorIcon aria-hidden="true" />}
      </InputWrapper>
    </Field>
  );
};

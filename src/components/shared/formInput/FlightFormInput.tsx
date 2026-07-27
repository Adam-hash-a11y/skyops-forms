import { FormType } from "../../flightForm/types";
import styled from "styled-components";

interface Props {
  name: string;
  type: FormType;
  value: string | number;
  placeholder: string;
  id: string;
  handleChange: (event: any) => void;
  label: string;
}

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  background: white;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #475569;
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
}) => {
  if (type == "select") {
    return (
      <>
        <StyledLabel htmlFor={id}>{label}:</StyledLabel>
        <StyledSelect value={value} name={name} id={id} onChange={handleChange}>
          <option value="" disabled>
            --Select a status--
          </option>
          <option value="Scheduled">Scheduled</option>
          <option value="Delayed">Delayed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Landed">Landed</option>
        </StyledSelect>
      </>
    );
  }
  return (
    <>
      <StyledLabel htmlFor={id}>{label}:</StyledLabel>
      <StyledInput
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        id={id}
        onChange={handleChange}
      />
    </>
  );
};

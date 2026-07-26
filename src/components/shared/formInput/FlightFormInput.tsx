import { FormType } from "../../flightForm/types";
import styled from "styled-components";

interface Props {
  name: string;
  type: FormType;
  value: string | number;
  placeholder: string;
  id: string;
  handleChange: (event: any) => void;
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

export const FormInput: React.FunctionComponent<Props> = ({
  name,
  type,
  value,
  placeholder,
  id,
  handleChange,
}) => {
  if (type == "select") {
    return (
      <StyledSelect value={value} name={name} onChange={handleChange}>
        <option value="" disabled>
          --Select a status--
        </option>
        <option value="Scheduled">Scheduled</option>
        <option value="Delayed">Delayed</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Landed">Landed</option>
      </StyledSelect>
    );
  }
  return (
    <StyledInput
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      id={id}
      onChange={handleChange}
    />
  );
};

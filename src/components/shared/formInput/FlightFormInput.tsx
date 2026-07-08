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
  display: block;
  width: 100%;
  max-width: 320px;
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
  display: block;
  width: 100%;
  max-width: 320px;
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
      <StyledSelect value={value} onChange={handleChange}>
        <option value="scheduled">Scheduled</option>
        <option value="delayed">Delayed</option>
        <option value="cancelled">Cancelled</option>
        <option value="landed">Landed</option>
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

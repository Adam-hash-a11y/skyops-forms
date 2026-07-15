import styled from "styled-components";
import { FormType } from "../../flightForm/types";
interface Props {
  name: string;
  type: FormType;
  value: string | number;
  placeholder: string;
  id: string;
  handleChange: (event: any) => void;
}
const StyledInput = styled.input`
  padding: 0.65rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const StyledSelect = styled.select`
  padding: 0.65rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  width: 100%;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
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
      <StyledSelect name={name} value={value} onChange={handleChange}>
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

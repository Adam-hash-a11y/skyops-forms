import { FormType } from "../../flightForm/types";
interface Props {
  name: string;
  type: FormType;
  value: string;
  placeholder: string;
  id: string;
  handleChange: (event: any) => void;
}
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
      <select value={value} onChange={handleChange}>
        <option value="scheduled">Scheduled</option>
        <option value="delayed">Delayed</option>
        <option value="cancelled">Cancelled</option>
        <option value="landed">Landed</option>
      </select>
    );
  }
  return (
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      id={id}
      onChange={handleChange}
    />
  );
};

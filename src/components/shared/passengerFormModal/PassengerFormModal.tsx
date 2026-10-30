import type React from "react";
import type { Passenger } from "../../../data/passengerData";
import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { LuX } from "react-icons/lu";
import { FormType } from "../flightFormModal/types";
import { FormInput } from "../formInput/FlightFormInput";
import { Button, ButtonVariant } from "../button/Button";
import { useReducer } from "react";
import { initialState, passengerReducer } from "./reducer";
import { SET_FIELD, SET_PASSENGER_TOUCHED } from "./action";

interface Props {
  handleSave: (passenger: Passenger) => void;
  handleClose: () => void;
  passenger?: Passenger;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;
const ModalBox = styled.div`
  border-radius: 12px;
  width: 620px;
  background-color: white;
  height: 570px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 24px;
  align-items: center;
  border-bottom: 1px solid #dce2eb;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  flex: 1;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 550px) {
    flex-direction: column;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: #f2f4f8;
  border-top: 1px solid #dce2eb;
  padding: 16px 24px;
  border-radius: 0 0 12px 12px;
  gap: 10px;
`;

const nationalityOptions = [
  { value: "", label: "Select..." },
  { value: "TN", label: "Tunisian" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "US", label: "American" },
  { value: "GB", label: "British" },
  { value: "IT", label: "Italian" },
  { value: "ES", label: "Spanish" },
  { value: "CA", label: "Canadian" },
  { value: "MA", label: "Moroccan" },
];

export const PassengerFormModal: React.FunctionComponent<Props> = ({
  handleSave,
  handleClose,
  passenger,
}) => {
  const startState = passenger
    ? {
        ...initialState,
        ...passenger,
        disabled: false,
      }
    : initialState;
  const [state, dispatch] = useReducer(passengerReducer, startState);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({
      type: SET_FIELD,
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleBlur = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({ type: SET_PASSENGER_TOUCHED, field: e.target.name });
  };

  const handleSubmit = () => {
    handleSave({
      firstName: state.firstName,
      lastName: state.lastName,
      passportNumber: state.passportNumber,
      nationality: state.nationality,
      dateOfBirth: state.dateOfBirth,
      email: state.email,
      phoneNumber: state.phoneNumber,
    });
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>
            {passenger ? "Edit passenger" : "New passenger"}
          </HeaderTitle>
          <IconButton handleButton={handleClose}>
            <LuX />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <FormRow>
            <FormInput
              name="firstName"
              type={FormType.TEXT}
              value={state.firstName}
              placeholder="Lena"
              id="FirstNameInput"
              label="First name"
              handleChange={handleChange}
              handleBlur={handleBlur}
              hint="Letters and spaces, min. 3 characters"
              error={state.errors.firstName}
              touched={state.touched.firstName}
            />

            <FormInput
              name="lastName"
              type={FormType.TEXT}
              value={state.lastName}
              placeholder="Banks"
              id="LastNameInput"
              label="Last name"
              handleChange={handleChange}
              handleBlur={handleBlur}
              hint="Letters and spaces, min. 3 characters"
              error={state.errors.lastName}
              touched={state.touched.lastName}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="passportNumber"
              type={FormType.TEXT}
              value={state.passportNumber}
              placeholder="DE7731902"
              id="PassportNumberInput"
              label="Passport number"
              handleChange={handleChange}
              handleBlur={handleBlur}
              hint="Min. 6 characters, unique"
              error={state.errors.passportNumber}
              touched={state.touched.passportNumber}
            />
            <FormInput
              name="nationality"
              type={FormType.SELECT}
              value={state.nationality}
              id="NationalityInput"
              handleChange={handleChange}
              label="Nationality"
              handleBlur={handleBlur}
              hint="Select a nationality"
              error={state.errors.nationality}
              touched={state.touched.nationality}
              options={nationalityOptions}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="dateOfBirth"
              type={FormType.TEXT}
              value={state.dateOfBirth}
              placeholder="1992-11-02"
              id="DateOfBirthInput"
              label="Date of birth"
              handleChange={handleChange}
              handleBlur={handleBlur}
              hint="YYYY-MM-DD, in the past"
              error={state.errors.dateOfBirth}
              touched={state.touched.dateOfBirth}
            />
            <FormInput
              name="email"
              type={FormType.TEXT}
              value={state.email}
              placeholder="name@example.com"
              id="EmailInput"
              label="Email"
              handleChange={handleChange}
              handleBlur={handleBlur}
              hint="Unique"
              error={state.errors.email}
              touched={state.touched.email}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="phoneNumber"
              type={FormType.TEXT}
              value={state.phoneNumber}
              placeholder="+4915194300275"
              id="PhoneNumberInput"
              label="Phone number"
              handleChange={handleChange}
              handleBlur={handleBlur}
              hint="Valid mobile number"
              error={state.errors.phoneNumber}
              touched={state.touched.phoneNumber}
            />
          </FormRow>
        </ModalBody>
        <ModalFooter>
          <Button label="Cancel" handleButton={handleClose} />
          <Button
            label={passenger ? "Save changes" : "Create passenger"}
            variant={ButtonVariant.PRIMARY}
            disabled={state.disabled}
            handleButton={handleSubmit}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

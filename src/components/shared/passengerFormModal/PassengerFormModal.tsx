import type React from "react";
import type { Passenger } from "../../../types/passengerTypes";
import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { LuX } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { FormType } from "../flightFormModal/types";
import { FormInput } from "../formInput/FlightFormInput";
import { Button, ButtonVariant } from "../button/Button";
import { useCallback, useReducer } from "react";
import { initialState, passengerReducer } from "./reducer";
import { PassengerFormActionType } from "./action";
import { theme } from "../../../theme/theme";
interface Props {
  handleSave: (
    firstName: string,
    lastName: string,
    passportNumber: string,
    nationality: string,
    dateOfBirth: string,
    email: string,
    phoneNumber: string,
  ) => void;
  handleClose: () => void;
  passenger?: Passenger;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndex.modal};
`;
const ModalBox = styled.div`
  border-radius: ${theme.borderRadius.xl};
  width: 620px;
  background-color: ${theme.colors.background.paper};
  height: 570px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.spacing[20]} ${theme.spacing[24]};
  align-items: center;
  border-bottom: 1px solid ${theme.colors.border.main};
`;

const HeaderTitle = styled.div`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[24]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[18]};
  overflow-y: auto;
  flex: 1;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing[20]};
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: ${theme.colors.background.main};
  border-top: 1px solid ${theme.colors.border.main};
  padding: ${theme.spacing[16]} ${theme.spacing[24]};
  border-radius: 0 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl};
  gap: ${theme.spacing[10]};
`;

export const PassengerFormModal: React.FunctionComponent<Props> = ({
  handleSave,
  handleClose,
  passenger,
}) => {
  const { t } = useTranslation();

  const nationalityOptions = [
    { value: "", label: t("passengerForm.select") },
    { value: "TN", label: t("nationality.TN") },
    { value: "FR", label: t("nationality.FR") },
    { value: "DE", label: t("nationality.DE") },
    { value: "US", label: t("nationality.US") },
    { value: "GB", label: t("nationality.GB") },
    { value: "IT", label: t("nationality.IT") },
    { value: "ES", label: t("nationality.ES") },
    { value: "CA", label: t("nationality.CA") },
    { value: "MA", label: t("nationality.MA") },
  ];

  const startState = passenger
    ? {
        ...initialState,
        ...passenger,
        disabled: false,
      }
    : initialState;
  const [state, dispatch] = useReducer(passengerReducer, startState);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: PassengerFormActionType.SET_FIELD,
        field: e.target.name,
        value: e.target.value,
      });
    },
    [],
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({
        type: PassengerFormActionType.SET_FIELD,
        field: e.target.name,
        value: e.target.value,
      });
    },
    [],
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      dispatch({
        type: PassengerFormActionType.SET_PASSENGER_TOUCHED,
        field: e.target.name,
      });
    },
    [],
  );

  const handleSelectBlur = useCallback(
    (e: React.FocusEvent<HTMLSelectElement>) => {
      dispatch({
        type: PassengerFormActionType.SET_PASSENGER_TOUCHED,
        field: e.target.name,
      });
    },
    [],
  );

  const handleSubmit = () => {
    handleSave(
      state.firstName,
      state.lastName,
      state.passportNumber,
      state.nationality,
      state.dateOfBirth,
      state.email,
      state.phoneNumber,
    );
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>
            {passenger
              ? t("passengerForm.editTitle")
              : t("passengerForm.newTitle")}
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
              label={t("passengerForm.firstName")}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              hint={t("passengerForm.nameHint")}
              error={state.errors.firstName}
              touched={state.touched.firstName}
            />

            <FormInput
              name="lastName"
              type={FormType.TEXT}
              value={state.lastName}
              placeholder="Banks"
              id="LastNameInput"
              label={t("passengerForm.lastName")}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              hint={t("passengerForm.nameHint")}
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
              label={t("passengerForm.passportNumber")}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              hint={t("passengerForm.passportHint")}
              error={state.errors.passportNumber}
              touched={state.touched.passportNumber}
              disabled={Boolean(passenger)}
            />
            <FormInput
              name="nationality"
              type={FormType.SELECT}
              value={state.nationality}
              id="NationalityInput"
              handleSelectChange={handleSelectChange}
              handleSelectBlur={handleSelectBlur}
              label={t("passengerForm.nationality")}
              hint={t("passengerForm.nationalityHint")}
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
              label={t("passengerForm.dateOfBirth")}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              hint={t("passengerForm.dateOfBirthHint")}
              error={state.errors.dateOfBirth}
              touched={state.touched.dateOfBirth}
            />
            <FormInput
              name="email"
              type={FormType.TEXT}
              value={state.email}
              placeholder="name@example.com"
              id="EmailInput"
              label={t("passengerForm.email")}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              hint={t("passengerForm.emailHint")}
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
              label={t("passengerForm.phoneNumber")}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              hint={t("passengerForm.phoneHint")}
              error={state.errors.phoneNumber}
              touched={state.touched.phoneNumber}
            />
          </FormRow>
        </ModalBody>
        <ModalFooter>
          <Button label={t("common.cancel")} handleButton={handleClose} />
          <Button
            label={
              passenger
                ? t("passengerForm.saveChanges")
                : t("passengerForm.create")
            }
            variant={ButtonVariant.PRIMARY}
            disabled={state.disabled}
            handleButton={handleSubmit}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

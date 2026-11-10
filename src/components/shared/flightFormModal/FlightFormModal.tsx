import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { useCallback, useReducer, type FunctionComponent } from "react";
import { LuX } from "react-icons/lu";
import { FormInput } from "../formInput/FlightFormInput";
import { flightReducer, initialState } from "./reducer";
import { FlightFormActionType } from "./action";
import { Button, ButtonVariant } from "../button/Button";
import { FormType } from "./types";
import { type Flight, FlightStatus } from "../../../types/flightTypes";
import { theme } from "../../../theme/theme";

interface Props {
  handleClose: () => void;
  handleSave: (
    flightNumber: string,
    airline: string,
    origin: string,
    destination: string,
    departureTime: string,
    arrivalTime: string,
    status: FlightStatus,
    firstSeats: string,
    businessSeats: string,
    economySeats: string,
  ) => void;
  flight?: Flight;
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
  height: 665px;
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

const statusOptions = [
  { value: FlightStatus.SCHEDULED, label: "Scheduled" },
  { value: FlightStatus.DELAYED, label: "Delayed" },
  { value: FlightStatus.CANCELLED, label: "Cancelled" },
  { value: FlightStatus.LANDED, label: "Landed" },
];

export const FlightFormModal: FunctionComponent<Props> = ({
  handleClose,
  flight,
  handleSave,
}) => {
  const startState = flight
    ? {
        ...initialState,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime.slice(0, 16),
        arrivalTime: flight.arrivalTime.slice(0, 16),
        status: flight.status,
        isEdit: true,
        disabled: false,
      }
    : initialState;
  const [state, dispatch] = useReducer(flightReducer, startState);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: FlightFormActionType.SET_FIELD,
        field: e.target.name,
        value: e.target.value,
      });
    },
    [],
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({
        type: FlightFormActionType.SET_FIELD,
        field: e.target.name,
        value: e.target.value,
      });
    },
    [],
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      dispatch({
        type: FlightFormActionType.SET_TOUCHED,
        field: e.target.name,
      });
    },
    [],
  );

  const handleSelectBlur = useCallback(
    (e: React.FocusEvent<HTMLSelectElement>) => {
      dispatch({
        type: FlightFormActionType.SET_TOUCHED,
        field: e.target.name,
      });
    },
    [],
  );

  const handleSubmit = () => {
    handleSave(
      state.flightNumber,
      state.airline,
      state.origin,
      state.destination,
      state.departureTime,
      state.arrivalTime,
      state.status,
      state.firstSeats,
      state.businessSeats,
      state.economySeats,
    );
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>{flight ? "Edit flight" : "New flight"}</HeaderTitle>
          <IconButton handleButton={handleClose}>
            <LuX />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <FormRow>
            <FormInput
              name="flightNumber"
              type={FormType.TEXT}
              value={state.flightNumber}
              placeholder="SKYOPS-10042"
              id="FlightNumberInput"
              label="Flight number"
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              hint="Must start with SKYOPS-"
              error={state.errors.flightNumber}
              touched={state.touched.flightNumber}
              disabled={Boolean(flight)}
            />
          </FormRow>

          <FormRow>
            <FormInput
              name="airline"
              type={FormType.TEXT}
              value={state.airline}
              placeholder="Airline"
              id="FlightAirlineInput"
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              label="Airline"
              error={state.errors.airline}
              touched={state.touched.airline}
              hint="Letters only, no spaces, min. 5"
            />

            <FormInput
              name="status"
              type={FormType.SELECT}
              value={state.status}
              placeholder="Status"
              id="StatusInput"
              handleSelectChange={handleSelectChange}
              handleSelectBlur={handleSelectBlur}
              label="Status"
              error={state.errors.status}
              touched={state.touched.status}
              options={statusOptions}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="origin"
              type={FormType.TEXT}
              value={state.origin}
              placeholder="Origin"
              id="FlightOriginInput"
              label="Origin"
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              error={state.errors.origin}
              touched={state.touched.origin}
              hint="3-letter IATA code"
            />

            <FormInput
              name="destination"
              type={FormType.TEXT}
              value={state.destination}
              placeholder="Destination"
              id="FlightDestinationInput"
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              label="Destination"
              error={state.errors.destination}
              touched={state.touched.destination}
              hint="3-letter IATA code"
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="departureTime"
              type={FormType.DATE_TIME_LOCAL}
              value={state.departureTime}
              placeholder="Departure Time"
              id="DepartureTimeInput"
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              label="Departure (UTC)"
              error={state.errors.departureTime}
              touched={state.touched.departureTime}
              hint="YYYY-MM-DD HH:mm, 24-hour"
            />

            <FormInput
              name="arrivalTime"
              type={FormType.DATE_TIME_LOCAL}
              value={state.arrivalTime}
              placeholder="Arrival Time"
              id="ArrivalTimeInput"
              label="Arrival (UTC)"
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              error={state.errors.arrivalTime}
              touched={state.touched.arrivalTime}
              hint="YYYY-MM-DD HH:mm, 24-hour"
            />
          </FormRow>

          {!flight && (
            <FormRow>
              <FormInput
                name="firstSeats"
                type={FormType.NUMBER}
                value={state.firstSeats}
                placeholder="First Seats"
                id="FirstSeatsInput"
                handleInputChange={handleInputChange}
                handleInputBlur={handleInputBlur}
                label="First seats"
                error={state.errors.firstSeats}
                touched={state.touched.firstSeats}
              />

              <FormInput
                name="businessSeats"
                type={FormType.NUMBER}
                value={state.businessSeats}
                placeholder="Business Seats"
                id="BusinessSeatsInput"
                handleInputChange={handleInputChange}
                handleInputBlur={handleInputBlur}
                label="Business seats"
                error={state.errors.businessSeats}
                touched={state.touched.businessSeats}
              />

              <FormInput
                name="economySeats"
                type={FormType.NUMBER}
                value={state.economySeats}
                placeholder="Economy Seats"
                id="EconomySeatsInput"
                handleInputChange={handleInputChange}
                handleInputBlur={handleInputBlur}
                label="Economy seats"
                error={state.errors.economySeats}
                touched={state.touched.economySeats}
              />
            </FormRow>
          )}
        </ModalBody>
        <ModalFooter>
          <Button label="Cancel" handleButton={handleClose} />
          <Button
            label={flight ? "Save changes" : "Create flight"}
            variant={ButtonVariant.PRIMARY}
            disabled={state.disabled}
            handleButton={handleSubmit}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

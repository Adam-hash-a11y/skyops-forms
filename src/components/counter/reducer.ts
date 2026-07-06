import { DECREMENT, INCREMENT, RESET } from "./action";

interface State {
  value: number;
  history: number[];
  disabledPlusButton: boolean;
}

export const intialState: State = {
  value: 0,
  history: [],
  disabledPlusButton: false,
};

export const counterReducer = (state: State, action: string) => {
  switch (action) {
    case INCREMENT:
      return {
        ...state,
        disabledPlusButton: state.value === 10,
        history: [...state.history, state.value <= 9 ? state.value + 1 : 10],
        value: state.value <= 9 ? state.value + 1 : 10,
      };

    case DECREMENT:
      return {
        ...state,
        disabledPlusButton: state.value === 10,
        history: [...state.history, state.value > 0 ? state.value - 1 : 0],
        value: state.value > 0 ? state.value - 1 : 0,
      };

    case RESET:
      return {
        ...state,
        value: 0,
        history: [],
        disabledPlusButton: false,
      };

    default:
      return state;
  }
};

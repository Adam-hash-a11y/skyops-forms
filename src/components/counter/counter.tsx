import { useReducer } from "react";
import { counterReducer, intialState } from "./reducer";
import { DECREMENT, INCREMENT, RESET } from "./action";

export const Counter = () => {
  const [state, dispatch] = useReducer(counterReducer, intialState);
  const handlePlus = () => {
    dispatch(INCREMENT);
  };
  const handleMinus = () => {
    dispatch(DECREMENT);
  };

  const handleReset = () => {
    dispatch(RESET);
  };
  return (
    <>
      <button disabled={state.disabledPlusButton} onClick={handlePlus}>
        +
      </button>
      <div>{state.value}</div>
      <button onClick={handleMinus}>-</button>
      <br />
      <button onClick={handleReset}>reset</button>
      <div>{state.history}</div>
    </>
  );
};

import { useReducer, useState } from "react";
import { counterReducer, intialState } from "./reducer";
import { DECREMENT, INCREMENT, RESET } from "./action";

export const Counter = () => {
  //   const [counter, setCounter] = useState(0);
  //   const [history, setHistory] = useState<number[]>([]);

  //   const handlePlus = () => {
  //     setCounter((prev) => prev + 1);
  //     setHistory([...history, counter]);
  //   };
  //   const handleMinus = () => {
  //     setHistory([...history, counter]);

  //     setCounter((prev) => {
  //       if (prev > 0) {
  //         return prev - 1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   };

  //   const handleReset = () => {
  //     setCounter(0);
  //     setHistory([]);
  //   };

  //   const handleDisabled = () => {
  //     if (counter > 9) return true;
  //   };

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

      {/* <button disabled={handleDisabled()} onClick={handlePlus}>
        +
      </button>
      <div>{counter}</div>
      <button onClick={handleMinus}>-</button>
      <br />
      <button onClick={handleReset}>reset</button>
      <div>{history}</div> */}
    </>
  );
};

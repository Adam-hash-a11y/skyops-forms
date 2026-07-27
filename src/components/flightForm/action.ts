export const SET_FIELD = "set_field";
export const SUBMIT = "submit";
export const RESET = "reset";

export type Action =
  | { type: typeof SET_FIELD; field: string; value: string }
  | { type: typeof SUBMIT }
  | { type: typeof RESET };

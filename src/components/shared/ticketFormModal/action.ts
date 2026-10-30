export const SET_FIELD = "set_field";
export const RESET = "reset";

export type Action =
  | { type: typeof SET_FIELD; field: string; value: string }
  | { type: typeof RESET };

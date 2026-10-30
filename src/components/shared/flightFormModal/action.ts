export const SET_FIELD = "set_field";
export const RESET = "reset";
export const SET_TOUCHED = "set_touched";

export type Action =
  | { type: typeof SET_FIELD; field: string; value: string }
  | { type: typeof RESET }
  | { type: typeof SET_TOUCHED; field: string };

export const CITY_NAMES: Record<string, string> = {
  TUN: "Tunis",
  FRA: "Frankfurt",
  MUC: "Munich",
  CDG: "Paris",
  ORY: "Paris",
  DUS: "Düsseldorf",
  MAD: "Madrid",
};

export const getCityName = (iataCityCode: string) => {
  return CITY_NAMES[iataCityCode] || iataCityCode;
};

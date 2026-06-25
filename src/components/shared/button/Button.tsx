import type { ReactNode } from "react";

interface Props {
  label: string;
  handleButton?: () => void;
  disabled?: boolean;
  children?: ReactNode;
}
export const Button: React.FunctionComponent<Props> = (p) => {
  console.log("called heres", p);
  if (p.children) {
    return (
      <button disabled={p.disabled} onClick={p.handleButton}>
        {p.children} {p.label}
      </button>
    );
  }
  return (
    <button disabled={p.disabled} onClick={p.handleButton}>
      {p.label}
    </button>
  );
};

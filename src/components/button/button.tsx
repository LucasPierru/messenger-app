import * as React from "react";

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({ buttonType, children, ...otherProps }: IButtonProps) {
  return (
    <button type="button" className={`bg-${buttonType}`} {...otherProps}>
      {children}
    </button>
  );
}

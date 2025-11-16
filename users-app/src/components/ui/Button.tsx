import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "danger" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({
                                                  variant = "primary",
                                                  className = "",
                                                  children,
                                                  ...rest
                                              }) => {
    const base =
        "px-3 py-2 rounded text-sm font-semibold transition w-full text-center";

    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
        secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
            {children}
        </button>
    );
};

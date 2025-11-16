import React from "react";

type Props = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<Props> = ({
                                           label,
                                           value,
                                           onChange,
                                           error,
                                           type = "text",
                                           placeholder,
                                           onKeyDown,
                                       }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>

        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 ${
                error
                    ? "border-red-400 focus:ring-red-300"
                    : "border-slate-300 focus:ring-emerald-400"
            }`}
        />

        {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
);

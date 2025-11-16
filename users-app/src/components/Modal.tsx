import React, { useEffect } from "react";

export const Modal = ({
                          isOpen,
                          title,
                          onClose,
                          children,
                      }: {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handle = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 w-full max-w-md animate-[fadeIn_0.2s_ease]">
            <header className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose}>✕</button>
                </header>
                {children}
            </div>
        </div>
    );
};

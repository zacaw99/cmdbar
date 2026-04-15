// src/CmdBarProvider.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type CmdBarContextType = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
};

const CmdBarContext = createContext<CmdBarContextType | null>(null);

export function CmdBarProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);
	const toggle = () => setIsOpen((v) => !v);

	return (
		<CmdBarContext.Provider value={{ isOpen, open, close, toggle }}>
			{children}
		</CmdBarContext.Provider>
	);
}

export function useCmdBar() {
	const ctx = useContext(CmdBarContext);
	if (!ctx) throw new Error("useCmdBar must be used within CmdBarProvider");
	return ctx;
}

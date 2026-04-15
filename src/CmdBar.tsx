// src/CmdBar.tsx
"use client";

import { useEffect } from "react";
import { useCmdBar } from "./CmdBarProvider";

export function CmdBar() {
	const { isOpen, close, toggle } = useCmdBar();

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				toggle();
			}

			if (e.key === "Escape") {
				close();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [toggle, close]);

	if (!isOpen) return null;

	return (
		<div style={overlayStyle}>
			<div style={modalStyle}>
				<input
					autoFocus
					placeholder="Type a command..."
					style={inputStyle}
				/>
			</div>
		</div>
	);
}

const overlayStyle: React.CSSProperties = {
	position: "fixed",
	inset: 0,
	background: "rgba(0,0,0,0.5)",
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "center",
	paddingTop: "10vh",
	zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
	width: "100%",
	maxWidth: "600px",
	background: "#111",
	borderRadius: "8px",
	padding: "12px",
};

const inputStyle: React.CSSProperties = {
	width: "100%",
	padding: "10px",
	fontSize: "16px",
	background: "transparent",
	border: "none",
	outline: "none",
	color: "#fff",
};

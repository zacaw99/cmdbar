import type { ReactNode } from "react";

export type CmdBarActionItem = {
	id: string;
	label: string;
	group?: string;
	keywords?: string[];
	icon?: ReactNode;
	disabled?: boolean;
	onSelect: () => void;
	href?: never;
};

export type CmdBarLinkItem = {
	id: string;
	label: string;
	group?: string;
	keywords?: string[];
	icon?: ReactNode;
	disabled?: boolean;
	href: string;
	onSelect?: never;
};

export type CmdBarItem = CmdBarActionItem | CmdBarLinkItem;

export type CmdBarState = {
	isOpen: boolean;
	query: string;
};

export type CmdBarControls = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	setQuery: (query: string) => void;
	clearQuery: () => void;
};

export type UseCmdBarResult = CmdBarState & CmdBarControls;

export type KeyBindConfig = {
	key: string;
	ctrlKey?: boolean;
	metaKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
};

export type CmdBarTheme = {
	mode?: "light" | "dark";
	colors?: {
		overlay?: string;
		background?: string;
		border?: string;
		text?: string;
		textSecondary?: string;
		itemHover?: string;
		itemSelected?: string;
	};
	radius?: {
		panel?: number | string;
		item?: number | string;
	};
	fonts?: {
		size?: {
			input?: number | string;
			label?: number | string;
			groupLabel?: number | string;
			meta?: number | string;
		};
		family?: string;
		weight?: {
			normal?: number;
			bold?: number;
		};
	};
	spacing?: {
		padding?: number | string;
		gap?: number | string;
	};
};

export type ResolvedCmdBarTheme = {
	mode: "light" | "dark";
	colors: {
		overlay: string;
		background: string;
		border: string;
		text: string;
		textSecondary: string;
		itemHover: string;
		itemSelected: string;
	};
	radius: {
		panel: number | string;
		item: number | string;
	};
	fonts: {
		size: {
			input: number | string;
			label: number | string;
			groupLabel: number | string;
			meta: number | string;
		};
		family: string;
		weight: {
			normal: number;
			bold: number;
		};
	};
	spacing: {
		padding: number | string;
		gap: number | string;
	};
};

export type CmdBarProps = {
	items?: CmdBarItem[];
	placeholder?: string;
	emptyText?: string;
	closeOnSelect?: boolean;
	keybind?: KeyBindConfig | false;
	theme?: CmdBarTheme;
};
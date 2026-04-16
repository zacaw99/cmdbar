"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCmdBar } from "./useCmdBar";
import type {
	CmdBarItem,
	CmdBarProps,
	CmdBarTheme,
	KeyBindConfig,
	ResolvedCmdBarTheme,
} from "./types";

const DEFAULT_KEYBIND: KeyBindConfig = {
	key: "k",
	ctrlKey: true,
	metaKey: true,
};

const LIGHT_THEME: CmdBarTheme = {
	mode: "light",
	colors: {
		overlay: "rgba(0, 0, 0, 0.25)",
		background: "#ffffff",
		border: "rgba(0, 0, 0, 0.08)",
		text: "#000000",
		textSecondary: "rgba(0, 0, 0, 0.6)",
		itemHover: "rgba(0, 0, 0, 0.05)",
		itemSelected: "rgba(0, 0, 0, 0.1)",
	},
	radius: {
		panel: "16px",
		item: "10px",
	},
	fonts: {
		family: "system-ui, -apple-system, sans-serif",
		size: {
			input: "16px",
			label: "14px",
			groupLabel: "12px",
			meta: "12px",
		},
		weight: { normal: 400, bold: 600 },
	},
};

const DARK_THEME: CmdBarTheme = {
	mode: "dark",
	colors: {
		overlay: "rgba(0, 0, 0, 0.45)",
		background: "#111214",
		border: "rgba(255, 255, 255, 0.08)",
		text: "#ffffff",
		textSecondary: "rgba(255, 255, 255, 0.6)",
		itemHover: "rgba(255, 255, 255, 0.05)",
		itemSelected: "rgba(255, 255, 255, 0.08)",
	},
	radius: {
		panel: "16px",
		item: "10px",
	},
	fonts: {
		family: "system-ui, -apple-system, sans-serif",
		size: {
			input: "16px",
			label: "14px",
			groupLabel: "12px",
			meta: "12px",
		},
		weight: { normal: 400, bold: 600 },
	},
};

const DEFAULT_ITEMS: CmdBarItem[] = [
	{
		id: "placeholder",
		label: "No items configured",
		group: "Info",
		onSelect: () => console.log("Please provide items to CmdBar"),
	},
];

function matchesItem(item: CmdBarItem, query: string) {
	if (!query.trim()) return true;

	const q = query.trim().toLowerCase();

	if (item.label.toLowerCase().includes(q)) {
		return true;
	}

	if (item.group?.toLowerCase().includes(q)) {
		return true;
	}

	if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) {
		return true;
	}

	return false;
}

function groupItems(items: CmdBarItem[]) {
	const groups = new Map<string, CmdBarItem[]>();

	for (const item of items) {
		const group = item.group ?? "Commands";

		if (!groups.has(group)) {
			groups.set(group, []);
		}

		groups.get(group)!.push(item);
	}

	return Array.from(groups.entries()).map(([group, groupItems]) => ({
		group,
		items: groupItems,
	}));
}

function isLinkItem(
	item: CmdBarItem,
): item is Extract<CmdBarItem, { href: string }> {
	return "href" in item;
}

function mergeThemes(
	base: CmdBarTheme,
	override?: CmdBarTheme,
): ResolvedCmdBarTheme {
	const merged: ResolvedCmdBarTheme = {
		mode: override?.mode ?? base.mode ?? "dark",
		colors: {
			overlay:
				override?.colors?.overlay ??
				base.colors?.overlay ??
				"rgba(0, 0, 0, 0.45)",
			background:
				override?.colors?.background ?? base.colors?.background ?? "#111214",
			border:
				override?.colors?.border ??
				base.colors?.border ??
				"rgba(255, 255, 255, 0.08)",
			text: override?.colors?.text ?? base.colors?.text ?? "#ffffff",
			textSecondary:
				override?.colors?.textSecondary ??
				base.colors?.textSecondary ??
				"rgba(255, 255, 255, 0.6)",
			itemHover:
				override?.colors?.itemHover ??
				base.colors?.itemHover ??
				"rgba(255, 255, 255, 0.05)",
			itemSelected:
				override?.colors?.itemSelected ??
				base.colors?.itemSelected ??
				"rgba(255, 255, 255, 0.08)",
		},
		radius: {
			panel: override?.radius?.panel ?? base.radius?.panel ?? "16px",
			item: override?.radius?.item ?? base.radius?.item ?? "10px",
		},
		fonts: {
			family:
				override?.fonts?.family ??
				base.fonts?.family ??
				"system-ui, -apple-system, sans-serif",
			size: {
				input:
					override?.fonts?.size?.input ?? base.fonts?.size?.input ?? "16px",
				label:
					override?.fonts?.size?.label ?? base.fonts?.size?.label ?? "14px",
				groupLabel:
					override?.fonts?.size?.groupLabel ??
					base.fonts?.size?.groupLabel ??
					"12px",
				meta: override?.fonts?.size?.meta ?? base.fonts?.size?.meta ?? "12px",
			},
			weight: {
				normal:
					override?.fonts?.weight?.normal ?? base.fonts?.weight?.normal ?? 400,
				bold: override?.fonts?.weight?.bold ?? base.fonts?.weight?.bold ?? 600,
			},
		},
		spacing: {
			padding: override?.spacing?.padding ?? base.spacing?.padding ?? "16px",
			gap: override?.spacing?.gap ?? base.spacing?.gap ?? "8px",
		},
	};
	return merged;
}

export function CmdBar({
	items = DEFAULT_ITEMS,
	placeholder = "Type a command...",
	emptyText = "No commands found.",
	closeOnSelect = true,
	keybind = DEFAULT_KEYBIND,
	theme,
}: CmdBarProps) {
	const { isOpen, query, close, toggle, setQuery } = useCmdBar();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const baseTheme = theme?.mode === "light" ? LIGHT_THEME : DARK_THEME;
	const mergedTheme = useMemo(() => mergeThemes(baseTheme, theme), [theme]);

	const filteredItems = useMemo(
		() => items.filter((item) => matchesItem(item, query)),
		[items, query],
	);

	const groupedItems = useMemo(
		() => groupItems(filteredItems),
		[filteredItems],
	);

	useEffect(() => {
		if (keybind === false) return;

		const keybindConfig = keybind || DEFAULT_KEYBIND;

		const onKeyDown = (event: KeyboardEvent) => {
			const matchesKeybind =
				event.key.toLowerCase() === keybindConfig.key.toLowerCase() &&
				(keybindConfig.ctrlKey ? event.ctrlKey : true) &&
				(keybindConfig.metaKey ? event.metaKey : true) &&
				(keybindConfig.shiftKey ? event.shiftKey : !event.shiftKey) &&
				(keybindConfig.altKey ? event.altKey : !event.altKey);

			if (matchesKeybind) {
				event.preventDefault();
				toggle();
				return;
			}

			if (event.key === "Escape") {
				close();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [keybind, toggle, close]);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
			setSelectedIndex(0);
		}
	}, [isOpen, query]);

	useEffect(() => {
		setSelectedIndex(0);
	}, [query]);

	useEffect(() => {
		if (selectedIndex > filteredItems.length - 1) {
			setSelectedIndex(0);
		}
	}, [filteredItems.length, selectedIndex]);

	if (!isOpen) return null;

	const handleSelect = (item: CmdBarItem) => {
		if (item.disabled) return;

		if (isLinkItem(item)) {
			window.location.assign(item.href);
		} else {
			item.onSelect();
		}

		if (closeOnSelect) {
			close();
		}
	};

	const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelectedIndex((current) =>
				filteredItems.length === 0 ? 0 : (current + 1) % filteredItems.length,
			);
			return;
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedIndex((current) =>
				filteredItems.length === 0
					? 0
					: (current - 1 + filteredItems.length) % filteredItems.length,
			);
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();
			const item = filteredItems[selectedIndex];
			if (item) {
				handleSelect(item);
			}
		}
	};

	let flatIndex = -1;

	// Generate theme-based styles
	const getOverlayStyle = (): React.CSSProperties => ({
		position: "fixed",
		inset: 0,
		width: "100svw",
		height: "100svh",
		background: mergedTheme.colors.overlay,
		display: "flex",
		justifyContent: "center",
		alignItems: "flex-start",
		padding: "10svh 16px 16px",
		zIndex: 9999,
		boxSizing: "border-box",
	});

	const getPanelStyle = (): React.CSSProperties => ({
		width: "100%",
		maxWidth: "720px",
		borderRadius:
			typeof mergedTheme.radius.panel === "number"
				? `${mergedTheme.radius.panel}px`
				: mergedTheme.radius.panel,
		background: mergedTheme.colors.background,
		border: `1px solid ${mergedTheme.colors.border}`,
		boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
		overflow: "hidden",
		fontFamily: mergedTheme.fonts.family,
	});

	const getInputStyle = (): React.CSSProperties => ({
		width: "100%",
		height: "56px",
		padding: "0 16px",
		border: "none",
		outline: "none",
		background: "transparent",
		color: mergedTheme.colors.text,
		fontSize: mergedTheme.fonts.size.input,
		fontFamily: mergedTheme.fonts.family,
		boxSizing: "border-box",
		borderBottom: `1px solid ${mergedTheme.colors.border}`,
	});

	const getResultsStyle = (): React.CSSProperties => ({
		maxHeight: "50svh",
		overflowY: "auto",
		padding: "8px",
		boxSizing: "border-box",
	});

	const getEmptyStyle = (): React.CSSProperties => ({
		padding: "16px",
		color: mergedTheme.colors.textSecondary,
		fontSize: mergedTheme.fonts.size.label,
		fontFamily: mergedTheme.fonts.family,
	});

	const getGroupStyle = (): React.CSSProperties => ({
		display: "grid",
		gap: "6px",
		padding: "8px 0",
	});

	const getGroupLabelStyle = (): React.CSSProperties => ({
		padding: "0 8px",
		fontSize: mergedTheme.fonts.size.groupLabel,
		fontWeight: mergedTheme.fonts.weight.bold,
		textTransform: "uppercase",
		letterSpacing: "0.04em",
		color: mergedTheme.colors.textSecondary,
		fontFamily: mergedTheme.fonts.family,
	});

	const getGroupItemsStyle = (): React.CSSProperties => ({
		display: "grid",
		gap: "4px",
	});

	const getItemStyle = (): React.CSSProperties => ({
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "12px",
		padding: "12px 10px",
		borderRadius:
			typeof mergedTheme.radius.item === "number"
				? `${mergedTheme.radius.item}px`
				: mergedTheme.radius.item,
		border: "none",
		background: "transparent",
		color: mergedTheme.colors.text,
		cursor: "pointer",
		textAlign: "left",
		fontSize: mergedTheme.fonts.size.label,
		fontFamily: mergedTheme.fonts.family,
		transition: "background-color 0.15s ease-out",
	});

	const getItemSelectedStyle = (): React.CSSProperties => ({
		background: mergedTheme.colors.itemSelected,
	});

	const getItemDisabledStyle = (): React.CSSProperties => ({
		opacity: 0.45,
		cursor: "not-allowed",
	});

	const getIconStyle = (): React.CSSProperties => ({
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		minWidth: "18px",
	});

	const getLabelStyle = (): React.CSSProperties => ({
		flex: 1,
		fontSize: mergedTheme.fonts.size.label,
		fontFamily: mergedTheme.fonts.family,
	});

	const getMetaStyle = (): React.CSSProperties => ({
		fontSize: mergedTheme.fonts.size.meta,
		color: mergedTheme.colors.textSecondary,
		fontFamily: mergedTheme.fonts.family,
	});

	return (
		<div
			style={getOverlayStyle()}
			onClick={close}
		>
			<div
				style={getPanelStyle()}
				onClick={(event) => event.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label="Command bar"
			>
				<input
					ref={inputRef}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					onKeyDown={onInputKeyDown}
					placeholder={placeholder}
					style={getInputStyle()}
				/>

				<div style={getResultsStyle()}>
					{groupedItems.length === 0 ? (
						<div style={getEmptyStyle()}>{emptyText}</div>
					) : (
						groupedItems.map((group) => (
							<div
								key={group.group}
								style={getGroupStyle()}
							>
								<div style={getGroupLabelStyle()}>{group.group}</div>

								<div style={getGroupItemsStyle()}>
									{group.items.map((item) => {
										flatIndex += 1;
										const isSelected = flatIndex === selectedIndex;

										return (
											<button
												key={item.id}
												type="button"
												onClick={() => handleSelect(item)}
												disabled={item.disabled}
												style={{
													...getItemStyle(),
													...(isSelected ? getItemSelectedStyle() : {}),
													...(item.disabled ? getItemDisabledStyle() : {}),
												}}
											>
												{item.icon ? (
													<span style={getIconStyle()}>{item.icon}</span>
												) : null}

												<span style={getLabelStyle()}>{item.label}</span>

												{isLinkItem(item) ? (
													<span style={getMetaStyle()}>{item.href}</span>
												) : null}
											</button>
										);
									})}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

# CmdBar

A lightweight, customizable command palette component for React & Next.js.

Provides a beautiful, accessible command palette with full theming support, custom keybinds, and smart search filtering.

## ✨ Features

- 🎯 **Simple API** - Pass items directly without wrapper components
- 🎨 **Full Customization** - Control colors, fonts, radius, spacing
- 🌓 **Dark & Light Mode** - Built-in theme presets with overrides
- ⌨️ **Custom Keybinds** - Define your own keyboard shortcuts
- 🎭 **Link & Action Items** - Support navigation links and callbacks
- 🔍 **Smart Search** - Filter by label, group, or keywords
- ♿ **Accessible** - ARIA labels, keyboard navigation
- 🪶 **No Dependencies** - Only requires React 18+
- ⚡ **Lightweight** - ~10KB minified

---

## 📦 Installation

```bash
npm install @zacaw99/cmdbar
```

---

## 🚀 Quick Start

### Option 1: Wrapper Component (Recommended)

Create a **Client Component** for interactive items:

```tsx
// app/components/CommandPalette.tsx
"use client";

import { CmdBar, type CmdBarItem } from "@zacaw99/cmdbar";

const items: CmdBarItem[] = [
	{
		id: "home",
		label: "Home",
		group: "Navigation",
		href: "/",
	},
	{
		id: "logout",
		label: "Logout",
		group: "Account",
		onSelect: () => {
			// Handle logout
		},
	},
];

export function CommandPalette() {
	return <CmdBar items={items} />;
}
```

Then use in your Server Component layout:

```tsx
// app/layout.tsx
import { CommandPalette } from "./components/CommandPalette";

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				<CommandPalette />
				{children}
			</body>
		</html>
	);
}
```

### Option 2: Basic Setup (No Callbacks)

For simple usage without interactive callbacks:

```tsx
// app/layout.tsx
import { CmdBar } from "@zacaw99/cmdbar";

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				<CmdBar />
				{children}
			</body>
		</html>
	);
}
```

---

## 📖 API Reference

### CmdBar Props

| Prop            | Type                     | Default                                      | Description                |
| --------------- | ------------------------ | -------------------------------------------- | -------------------------- |
| `items`         | `CmdBarItem[]`           | Placeholder                                  | Array of command items     |
| `placeholder`   | `string`                 | `"Type a command..."`                        | Input placeholder text     |
| `emptyText`     | `string`                 | `"No commands found."`                       | Empty state text           |
| `closeOnSelect` | `boolean`                | `true`                                       | Close after selecting item |
| `keybind`       | `KeyBindConfig \| false` | `{ key: "k", ctrlKey: true, metaKey: true }` | Keyboard shortcut config   |
| `theme`         | `CmdBarTheme`            | `dark`                                       | Theme configuration        |

### CmdBarItem

```tsx
type CmdBarActionItem = {
	id: string;
	label: string;
	group?: string;
	keywords?: string[];
	icon?: ReactNode;
	disabled?: boolean;
	onSelect: () => void;
};

type CmdBarLinkItem = {
	id: string;
	label: string;
	group?: string;
	keywords?: string[];
	icon?: ReactNode;
	disabled?: boolean;
	href: string;
};

type CmdBarItem = CmdBarActionItem | CmdBarLinkItem;
```

---

## 🎨 Customization

### Custom Keybinds

```tsx
<CmdBar
	items={items}
	keybind={{
		key: "p",
		ctrlKey: true,
		shiftKey: true,
	}}
/>
```

Disable keybind:

```tsx
<CmdBar
	items={items}
	keybind={false}
/>
```

### Themes

Dark mode (default):

```tsx
<CmdBar
	items={items}
	theme={{ mode: "dark" }}
/>
```

Light mode:

```tsx
<CmdBar
	items={items}
	theme={{ mode: "light" }}
/>
```

Custom colors:

```tsx
<CmdBar
	items={items}
	theme={{
		colors: {
			background: "#1e1e1e",
			text: "#ffffff",
			itemSelected: "rgba(255, 255, 255, 0.12)",
			border: "rgba(255, 255, 255, 0.1)",
		},
	}}
/>
```

Full theme configuration:

```tsx
type CmdBarTheme = {
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
		family?: string;
		size?: {
			input?: number | string;
			label?: number | string;
			groupLabel?: number | string;
			meta?: number | string;
		};
		weight?: { normal?: number; bold?: number };
	};
	spacing?: {
		padding?: number | string;
		gap?: number | string;
	};
};
```

---

## 🪝 Hooks

### useCmdBar()

Access state and controls from any Client Component:

```tsx
"use client";

import { useCmdBar } from "@zacaw99/cmdbar";

export function MyComponent() {
	const { isOpen, query, toggle, setQuery } = useCmdBar();

	return <button onClick={toggle}>Toggle CmdBar</button>;
}
```

### Programmatic Control

```tsx
import { cmdbar } from "@zacaw99/cmdbar";

cmdbar.open();
cmdbar.close();
cmdbar.toggle();
cmdbar.setQuery("search");
cmdbar.clearQuery();
```

---

## ⌨️ Keyboard Shortcuts

- **Cmd+K** (Mac) / **Ctrl+K** (Windows/Linux) - Toggle palette
- **↑/↓** - Navigate items
- **Enter** - Select item
- **Escape** - Close palette

---

## 🏗️ Architecture

CmdBar uses a **store-based** state management approach with a minimal client footprint. Always wrap interactive items in a Client Component wrapper to keep your layout as a Server Component.

**Why?**

- Preserves server-side capabilities (metadata, database queries)
- Minimal client JavaScript
- Better performance
- Clear separation of concerns

---

## 📋 Examples

### With Icons

```tsx
import { Home, Settings, LogOut } from "lucide-react";

const items: CmdBarItem[] = [
	{
		id: "home",
		label: "Home",
		icon: <Home size={16} />,
		href: "/",
	},
	{
		id: "settings",
		label: "Settings",
		icon: <Settings size={16} />,
		href: "/settings",
	},
];
```

### Grouped Items

```tsx
const items: CmdBarItem[] = [
	{ id: "home", label: "Home", group: "Navigation", href: "/" },
	{ id: "about", label: "About", group: "Navigation", href: "/about" },
	{ id: "new", label: "Create", group: "Actions", onSelect: () => {} },
	{ id: "settings", label: "Settings", group: "Settings", onSelect: () => {} },
];
```

### Conditional Items

```tsx
const items: CmdBarItem[] = [
	{
		id: "admin",
		label: "Admin Panel",
		href: "/admin",
		disabled: !isAdmin,
	},
];
```

---

## 🌐 Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest (14+)
- Mobile browsers: Full support

---

## 📝 License

MIT

---

## 👤 Author

Created by **zacaw99**

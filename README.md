# cmdbar

Minimal command bar for React apps.

## Install

npm i cmdbar

## Usage

```tsx
import { CmdBarProvider, CmdBar } from "cmdbar";

export default function App() {
	return (
		<CmdBarProvider>
			<YourApp />
			<CmdBar />
		</CmdBarProvider>
	);
}
```

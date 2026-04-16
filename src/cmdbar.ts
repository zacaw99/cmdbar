import { cmdbarStore } from "./store";

export const cmdbar = {
	open: cmdbarStore.open,
	close: cmdbarStore.close,
	toggle: cmdbarStore.toggle,
	setQuery: cmdbarStore.setQuery,
	clearQuery: cmdbarStore.clearQuery,
};

import type { CmdBarState } from "./types";

type Listener = (state: CmdBarState) => void;

const state: CmdBarState = {
	isOpen: false,
	query: "",
};

const listeners = new Set<Listener>();

function emit() {
	for (const listener of listeners) {
		listener({ ...state });
	}
}

export const cmdbarStore = {
	getState(): CmdBarState {
		return { ...state };
	},

	subscribe(listener: Listener) {
		listeners.add(listener);

		return () => {
			listeners.delete(listener);
		};
	},

	open() {
		state.isOpen = true;
		emit();
	},

	close() {
		state.isOpen = false;
		state.query = "";
		emit();
	},

	toggle() {
		state.isOpen = !state.isOpen;

		if (!state.isOpen) {
			state.query = "";
		}

		emit();
	},

	setQuery(query: string) {
		state.query = query;
		emit();
	},

	clearQuery() {
		state.query = "";
		emit();
	},
};

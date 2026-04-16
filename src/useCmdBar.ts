"use client";

import { useEffect, useMemo, useState } from "react";
import { cmdbarStore } from "./store";
import type { UseCmdBarResult } from "./types";

export function useCmdBar(): UseCmdBarResult {
	const [state, setState] = useState(cmdbarStore.getState());

	useEffect(() => {
		return cmdbarStore.subscribe(setState);
	}, []);

	return useMemo(
		() => ({
			isOpen: state.isOpen,
			query: state.query,
			open: cmdbarStore.open,
			close: cmdbarStore.close,
			toggle: cmdbarStore.toggle,
			setQuery: cmdbarStore.setQuery,
			clearQuery: cmdbarStore.clearQuery,
		}),
		[state],
	);
}
